using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicies.Commands;

public class DeleteContentPolicyHandler
    (IUnitOfWork uow, IContentPolicyRepository contentPolicyRepository, IContentPolicyCache contentPolicyCache)
    : IRequestHandler<DeleteContentPolicyRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteContentPolicyRequest request, CancellationToken cancellationToken)
    {
        var policy = await contentPolicyRepository.FindAsync(request.Id, cancellationToken);
        if (policy is null)
            return OperationResult.Fail();

        contentPolicyRepository.Remove(policy);
        var saveResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveResult.IsSuccess)
            return OperationResult.Fail();

        await contentPolicyCache.InvalidateAllAsync(cancellationToken);
        return OperationResult.Success();
    }
}
