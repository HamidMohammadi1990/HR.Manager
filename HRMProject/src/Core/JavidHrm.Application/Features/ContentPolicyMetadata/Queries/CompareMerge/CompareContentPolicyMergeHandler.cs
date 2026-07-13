using JavidHrm.Common.Models;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class CompareContentPolicyMergeHandler
    (IContentPolicyPreviewService previewService, IContentPolicyMapperService mapper)
    : IRequestHandler<CompareContentPolicyMergeRequest, OperationResult<CompareContentPolicyMergeResponse>>
{
    public async Task<OperationResult<CompareContentPolicyMergeResponse>> Handle(
        CompareContentPolicyMergeRequest request,
        CancellationToken cancellationToken)
    {
        var requestDto = mapper.Map(request);
        var result = await previewService.CompareMergeAsync(requestDto, cancellationToken);
        if (result is null)
            return OperationResult<CompareContentPolicyMergeResponse>.Fail();

        return mapper.Map(result);
    }
}
