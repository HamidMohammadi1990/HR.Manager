using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class UpdateBackupJobHandler
    (IBackupJobRepository backupJobRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateBackupJobRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateBackupJobRequest request, CancellationToken cancellationToken)
    {
        var backupJob = await backupJobRepository.FindAsync(request.Id, cancellationToken);
        if (backupJob is null)
            return ErrorModel.Create("InvalidId");

        backupJob.Update(request.Type);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
