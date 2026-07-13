using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.BackupJobs.Commands;

public class DeleteBackupJobHandler
    (IBackupJobRepository backupJobRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteBackupJobRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteBackupJobRequest request, CancellationToken cancellationToken)
    {
        var backupJob = await backupJobRepository.FindAsync(request.Id, cancellationToken);
        if (backupJob is null)
            return ErrorModel.Create("InvalidId");

        backupJobRepository.Remove(backupJob);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
