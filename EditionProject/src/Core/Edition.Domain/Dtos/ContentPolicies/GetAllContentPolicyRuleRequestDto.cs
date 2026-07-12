using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.ContentPolicies;

public record GetAllContentPolicyRuleRequestDto
{
    [QueryFilter]
    public int? PolicyId { get; init; }

    [QueryFilter(MemberPath = "Policy.EntityType")]
    public string? EntityType { get; init; }

    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? FieldPath { get; init; }

    [QueryFilter]
    public ContentPolicyOperator? Operator { get; init; }

    [QueryFilter]
    public ContentPolicyValueType? ValueType { get; init; }

    [QueryFilter]
    public ContentPolicyRuleGroup? RuleGroup { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
