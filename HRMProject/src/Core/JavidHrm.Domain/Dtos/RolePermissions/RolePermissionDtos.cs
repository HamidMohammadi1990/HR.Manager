using JavidHrm.Domain.QueryFilters;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Dtos.RolePermissions;

public record GetAllRolePermissionRequestDto
{
    [QueryFilter(MemberPath = "rolePermission.RoleId")]
    public int? RoleId { get; init; }

    [QueryFilter(MemberPath = "rolePermission.PermissionId")]
    public PermissionType? PermissionId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}

public record GetAllRolePermissionDto
{
    public int Id { get; init; }
    public int RoleId { get; init; }
    public string RoleTitle { get; init; } = default!;
    public PermissionType PermissionId { get; init; }
    public string PermissionTitle { get; init; } = default!;
}

public record GetRolePermissionDto
{
    public int Id { get; init; }
    public int RoleId { get; init; }
    public string RoleTitle { get; init; } = default!;
    public PermissionType PermissionId { get; init; }
    public string PermissionTitle { get; init; } = default!;
}