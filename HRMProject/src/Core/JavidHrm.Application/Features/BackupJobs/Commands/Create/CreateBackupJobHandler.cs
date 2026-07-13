using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class CreateBackupJobHandler
    (IUnitOfWork uow, IBackupJobRepository backupJobRepository, ICurrentUserContext currentUser)
    : IRequestHandler<CreateBackupJobRequest, OperationResult<CreateBackupJobResponse>>
{
    public async Task<OperationResult<CreateBackupJobResponse>> Handle(CreateBackupJobRequest request, CancellationToken cancellationToken)
    {
        var backupJob = Domain.Entities.BackupJob.Create(
            request.FileName.Trim(),
            request.Type,
            request.StoragePath.Trim(),
            currentUser.UserId);

        backupJobRepository.Add(backupJob);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateBackupJobResponse>();

        return new CreateBackupJobResponse { Id = backupJob.Id };
    }
}
