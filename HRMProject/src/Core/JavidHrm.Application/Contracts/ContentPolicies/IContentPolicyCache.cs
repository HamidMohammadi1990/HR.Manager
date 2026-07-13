using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyCache
{
    Task<CachedUserContentPolicyContext?> GetUserContextAsync(int userId, CancellationToken cancellationToken = default);
    Task SetUserContextAsync(int userId, CachedUserContentPolicyContext context, CancellationToken cancellationToken = default);
    Task<ContentPolicyResolutionResult> ResolvePoliciesAsync(
        string entityType,
        ContentPolicyQueryAction queryAction,
        int userId,
        IReadOnlyList<int> roleIds,
        CancellationToken cancellationToken = default);
    Task InvalidateUserAsync(int userId, CancellationToken cancellationToken = default);
    Task InvalidateAllAsync(CancellationToken cancellationToken = default);
    Task<long> GetGenerationAsync(CancellationToken cancellationToken = default);
}

public sealed record CachedUserContentPolicyContext(
    IReadOnlyList<UserRolePolicyDto> Roles,
    IReadOnlyList<int> DepartmentIds,
    IReadOnlyList<int> RoleIds);

public sealed record CachedContentPolicyResolution(
    ContentPolicyResolutionResult Resolution,
    DateTime CachedOnUtc);
