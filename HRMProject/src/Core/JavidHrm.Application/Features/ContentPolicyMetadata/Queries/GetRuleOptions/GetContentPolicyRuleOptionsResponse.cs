using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyRuleOptionsResponse
{
    public IReadOnlyList<ContentPolicyEnumOptionDto> Operators { get; init; } = [];
    public IReadOnlyList<ContentPolicyEnumOptionDto> Effects { get; init; } = [];
    public IReadOnlyList<ContentPolicyEnumOptionDto> ValueTypes { get; init; } = [];
    public IReadOnlyList<ContentPolicyEnumOptionDto> QueryActions { get; init; } = [];
    public IReadOnlyList<ContentPolicyEnumOptionDto> RuleGroups { get; init; } = [];
    public IReadOnlyList<ContentPolicyEnumOptionDto> MergeModes { get; init; } = [];
    public IReadOnlyList<ContentPolicyContextPathDto> ContextPaths { get; init; } = [];
}
