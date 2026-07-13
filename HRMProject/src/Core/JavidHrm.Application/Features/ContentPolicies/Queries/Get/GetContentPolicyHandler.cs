using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public class GetContentPolicyHandler
    (IContentPolicyRepository contentPolicyRepository, IContentPolicyMapperService mapper)
    : IRequestHandler<GetContentPolicyRequest, OperationResult<GetContentPolicyResponse?>>
{
    public async Task<OperationResult<GetContentPolicyResponse?>> Handle(
        GetContentPolicyRequest request,
        CancellationToken cancellationToken)
    {
        var policy = await contentPolicyRepository.FindWithRulesAsync(request.Id, cancellationToken);
        if (policy is null)
            return default(GetContentPolicyResponse?);

        return mapper.Map(policy);
    }
}
