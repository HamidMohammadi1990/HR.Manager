using JavidHrm.Domain.Entities;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Features.ContentPolicies.Queries;
using JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IContentPolicyMapperService : IMapper
{
    GetAllContentPolicyRequestDto Map(GetAllContentPolicyRequest model);
    PagedResult<GetAllContentPolicyResponse> Map(PagedResult<ContentPolicy> model);
    GetContentPolicyResponse Map(ContentPolicy model);
    GetContentPolicyEntitySchemaRequestDto Map(GetContentPolicyEntitySchemaRequest model);
    GetContentPolicyEntitySchemaResponse Map(
        GetContentPolicyEntitySchemaRequest model,
        IReadOnlyList<ContentPolicySchemaPropertyDto> properties);
    GetContentPolicyPropertyOperatorsRequestDto Map(GetContentPolicyPropertyOperatorsRequest model);
    GetContentPolicyPropertyOperatorsResponse Map(
        GetContentPolicyPropertyOperatorsRequestDto request,
        IReadOnlyList<ContentPolicyOperator> operators);
    ValidateContentPolicyRulesRequestDto Map(ValidateContentPolicyRulesRequest model);
    ValidateContentPolicyRulesResponse Map(ContentPolicyRuleValidationResultDto model);
    PreviewContentPolicyRequestDto Map(PreviewContentPolicyRequest model);
    PreviewContentPolicyResponse Map(ContentPolicyPreviewResultDto model);
    CompareContentPolicyMergeRequestDto Map(CompareContentPolicyMergeRequest model);
    CompareContentPolicyMergeResponse Map(ContentPolicyMergeCompareResultDto model);
    GetContentPolicyPolicySetsRequestDto MapPolicySetsRequest(
        CompareContentPolicyMergeRequestDto request,
        IReadOnlyList<int> roleIds);
    ContentPolicyWithRulesDto MapDraftPolicy(CompareContentPolicyMergeRequestDto request);
    IReadOnlyList<ContentPolicyPreviewPolicyDto> Map(IReadOnlyList<ContentPolicyWithRulesDto> policies);
    ContentPolicyPreviewResultDto MapPreviewResult(
        PreviewContentPolicyRequestDto request,
        ContentPolicyScenarioPreviewDto scenario,
        CachedUserContentPolicyContext userContext,
        bool bypassContentPolicy,
        bool requireContentPolicy);
    ContentPolicyMergeCompareResultDto MapCompareResult(
        CompareContentPolicyMergeRequestDto request,
        CachedUserContentPolicyContext userContext,
        bool bypassContentPolicy,
        bool requireContentPolicy,
        ContentPolicyMergeMode currentMergeMode,
        ContentPolicyScenarioPreviewDto current,
        ContentPolicyScenarioPreviewDto roleOnly,
        ContentPolicyScenarioPreviewDto additive,
        ContentPolicyScenarioPreviewDto replaceRole);
    IReadOnlyList<ContentPolicyEnumOptionDto> MapEnumOptions<TEnum>() where TEnum : struct, Enum;
}
