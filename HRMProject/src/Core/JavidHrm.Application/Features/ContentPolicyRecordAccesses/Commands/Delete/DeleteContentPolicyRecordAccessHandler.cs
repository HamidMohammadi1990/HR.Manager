using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Commands;

public class DeleteContentPolicyRecordAccessHandler
    (
        IUnitOfWork uow,
        IContentPolicyRecordAccessRepository recordAccessRepository,
        IContentPolicyCache contentPolicyCache)
    : IRequestHandler<DeleteContentPolicyRecordAccessRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteContentPolicyRecordAccessRequest request, CancellationToken cancellationToken)
    {
        var recordAccess = await recordAccessRepository.FindAsync(request.Id, cancellationToken);
        if (recordAccess is null)
            return ErrorModel.Create("InvalidId");

        recordAccessRepository.Remove(recordAccess);

        var saveResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveResult.IsSuccess)
            return saveResult;

        await contentPolicyCache.InvalidateAllAsync(cancellationToken);
        return OperationResult.Success();
    }
}
