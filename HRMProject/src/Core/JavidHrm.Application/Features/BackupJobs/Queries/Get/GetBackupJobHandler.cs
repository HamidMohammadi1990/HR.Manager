using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.BackupJobs.Queries;

public class GetBackupJobHandler
    (IBackupJobRepository backupJobRepository, IUserRepository userRepository, IBackupJobMapperService mapper)
    : IRequestHandler<GetBackupJobRequest, OperationResult<GetBackupJobResponse?>>
{
    public async Task<OperationResult<GetBackupJobResponse?>> Handle(GetBackupJobRequest request, CancellationToken cancellationToken)
    {
        var backupJob = await backupJobRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (backupJob is null)
            return (GetBackupJobResponse?)null;

        var creator = await userRepository.GetAsNoTrackingAsync(backupJob.CreatedByUserId, cancellationToken);
        if (creator is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(backupJob, creator);
    }
}
