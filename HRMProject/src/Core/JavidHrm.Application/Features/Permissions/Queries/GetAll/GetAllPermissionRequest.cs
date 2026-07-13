using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Permissions.Queries;

public record GetAllPermissionRequest : IRequest<OperationResult<PagedResult<GetAllPermissionResponse>>>, IContentPolicyFilteredRequest<Permission>
{
    public string? Title { get; init; } = null!;
    public string? Url { get; init; } = null!;
    public string? NameSpace { get; init; }
    public PermissionType? ParentId { get; init; }
    public PermissionLevelType? LevelTypeId { get; init; }
    public bool? IsActive { get; init; } = true;
    public PagedRequest Pagination { get; init; } = default!;
}