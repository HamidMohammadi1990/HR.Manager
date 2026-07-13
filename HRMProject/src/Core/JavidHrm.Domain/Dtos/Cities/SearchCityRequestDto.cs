using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Cities;

public record SearchCityRequestDto
{
    [QueryFilter]
    public int? ProvinceId { get; init; }

    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    [QueryFilter]
    public string? Slug { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}