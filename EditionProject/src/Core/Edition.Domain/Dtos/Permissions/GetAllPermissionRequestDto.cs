using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Permissions;

public record GetAllPermissionRequestDto
{
    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Title { get; init; } = null!;

    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Url { get; init; } = null!;

    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? NameSpace { get; init; }

    [QueryFilter]
    public PermissionType? ParentId { get; init; }

    [QueryFilter]
    public PermissionLevelType? LevelTypeId { get; init; }

    [QueryFilter]
    public bool? IsActive { get; init; } = true;

    public PagedRequest Pagination { get; init; } = default!;
}
