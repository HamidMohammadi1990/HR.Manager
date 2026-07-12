using JavidHrm.Common.Models;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class PreviewContentPolicyHandler
    (IContentPolicyPreviewService previewService, IContentPolicyMapperService mapper)
    : IRequestHandler<PreviewContentPolicyRequest, OperationResult<PreviewContentPolicyResponse>>
{
    public async Task<OperationResult<PreviewContentPolicyResponse>> Handle(
        PreviewContentPolicyRequest request,
        CancellationToken cancellationToken)
    {
        var requestDto = mapper.Map(request);
        var result = await previewService.PreviewAsync(requestDto, cancellationToken);
        if (result is null)
            return OperationResult<PreviewContentPolicyResponse>.Fail();

        return mapper.Map(result);
    }
}
