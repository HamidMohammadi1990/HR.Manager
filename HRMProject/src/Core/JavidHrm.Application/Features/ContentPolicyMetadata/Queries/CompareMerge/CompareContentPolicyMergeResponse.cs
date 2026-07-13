using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record CompareContentPolicyMergeResponse
{
    public int UserId { get; init; }
    public string EntityType { get; init; }
    public ContentPolicyQueryAction QueryAction { get; init; } = ContentPolicyQueryAction.GetAll;
    public bool BypassContentPolicy { get; init; }
    public bool RequireContentPolicy { get; init; }
    public bool IncludesDraftPolicy { get; init; }
    public IReadOnlyList<UserRolePolicyDto> Roles { get; init; } = [];
    public IReadOnlyList<int> DepartmentIds { get; init; } = [];
    public ContentPolicyMergeCompareScenarioDto Current { get; init; } = default!;
    public ContentPolicyMergeCompareScenarioDto RoleOnly { get; init; } = default!;
    public ContentPolicyMergeCompareScenarioDto Additive { get; init; } = default!;
    public ContentPolicyMergeCompareScenarioDto ReplaceRole { get; init; } = default!;
    public ContentPolicyMergeCompareDiffDto Diff { get; init; } = default!;
}
