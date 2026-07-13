using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.ContentPolicies;

public record GetAllContentPolicyRequestDto
{
    [QueryFilter]
    public int? RoleId { get; init; }

    [QueryFilter]
    public int? UserId { get; init; }

    [QueryFilter]
    public string? EntityType { get; init; }

    [QueryFilter]
    public ContentPolicyQueryAction? QueryAction { get; init; }

    [QueryFilter]
    public bool? IsActive { get; init; }

    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
