namespace JavidHrm.Application.Models.ContentPolicies;

public sealed record ContentPolicyContext(
    int UserId,
    IReadOnlyList<int> DepartmentIds,
    IReadOnlyList<int> RoleIds);
