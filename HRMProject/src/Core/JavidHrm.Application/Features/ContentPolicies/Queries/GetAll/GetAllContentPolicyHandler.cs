using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public class GetAllContentPolicyHandler
    (IContentPolicyRepository contentPolicyRepository, IContentPolicyMapperService mapper)
    : IRequestHandler<GetAllContentPolicyRequest, OperationResult<PagedResult<GetAllContentPolicyResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllContentPolicyResponse>>> Handle(
        GetAllContentPolicyRequest request,
        CancellationToken cancellationToken)
    {
        var requestDto = mapper.Map(request);
        var policies = await contentPolicyRepository.GetAllAsync(requestDto, cancellationToken);
        return mapper.Map(policies);
    }
}
