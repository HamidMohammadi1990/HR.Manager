using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.UserRoles;

public record GetAllUserRoleRequestDto
{
    [QueryFilter(MemberPath = "userRole.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "userRole.RoleId")]
    public int? RoleId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}

public record GetAllUserRoleDto
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public string UserName { get; init; } = default!;
    public int RoleId { get; init; }
    public string RoleTitle { get; init; } = default!;
}

public record GetUserRoleDto
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public string UserName { get; init; } = default!;
    public int RoleId { get; init; }
    public string RoleTitle { get; init; } = default!;
}
