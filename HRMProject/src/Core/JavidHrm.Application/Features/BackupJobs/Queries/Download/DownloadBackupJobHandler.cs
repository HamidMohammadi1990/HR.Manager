using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using Microsoft.AspNetCore.Hosting;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class DownloadBackupJobHandler
    (IBackupJobRepository backupJobRepository, IWebHostEnvironment webHostEnvironment)
    : IRequestHandler<DownloadBackupJobRequest, OperationResult<DownloadBackupJobResponse>>
{
    public async Task<OperationResult<DownloadBackupJobResponse>> Handle(DownloadBackupJobRequest request, CancellationToken cancellationToken)
    {
        var backupJob = await backupJobRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (backupJob is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (backupJob.Status != BackupStatus.Completed)
            return ErrorModel.Create(MessageKeys.InvalidRequest);

        var fullPath = Path.Combine(webHostEnvironment.WebRootPath, backupJob.StoragePath.Replace('/', Path.DirectorySeparatorChar));
        if (!File.Exists(fullPath))
            return ErrorModel.Create(MessageKeys.InvalidId);

        var fileBytes = await File.ReadAllBytesAsync(fullPath, cancellationToken);

        return new DownloadBackupJobResponse
        {
            FileBytes = fileBytes,
            FileName = backupJob.FileName,
            ContentType = "application/json"
        };
    }
}
