using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;
using Microsoft.AspNetCore.Hosting;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class CreateBackupHandler
    (IUnitOfWork uow, IBackupJobRepository backupJobRepository, ICurrentUserContext currentUser, IWebHostEnvironment webHostEnvironment)
    : IRequestHandler<CreateBackupRequest, OperationResult<CreateBackupResponse>>
{
    public async Task<OperationResult<CreateBackupResponse>> Handle(CreateBackupRequest request, CancellationToken cancellationToken)
    {
        var fileName = $"hr-backup-{DateTime.UtcNow:yyyyMMddHHmmss}.json";
        var storagePath = Path.Combine("backups", fileName).Replace('\\', '/');
        var backupDir = Path.Combine(webHostEnvironment.WebRootPath, "backups");
        Directory.CreateDirectory(backupDir);
        var fullPath = Path.Combine(backupDir, fileName);

        var backupJob = Domain.Entities.BackupJob.Create(
            fileName,
            request.Type,
            storagePath,
            currentUser.UserId);

        backupJobRepository.Add(backupJob);
        backupJob.MarkInProgress();

        var initialSave = await uow.SaveChangesAsync(cancellationToken);
        if (!initialSave.IsSuccess)
            return initialSave.ToGenericFailure<CreateBackupResponse>();

        try
        {
            var json = await backupJobRepository.BuildHrBackupJsonAsync(cancellationToken);
            await File.WriteAllTextAsync(fullPath, json, cancellationToken);
            backupJob.MarkCompleted(new FileInfo(fullPath).Length);
        }
        catch (Exception ex)
        {
            backupJob.MarkFailed(ex.Message);
        }

        var finalSave = await uow.SaveChangesAsync(cancellationToken);
        if (!finalSave.IsSuccess)
            return finalSave.ToGenericFailure<CreateBackupResponse>();

        return new CreateBackupResponse { Id = backupJob.Id };
    }
}
