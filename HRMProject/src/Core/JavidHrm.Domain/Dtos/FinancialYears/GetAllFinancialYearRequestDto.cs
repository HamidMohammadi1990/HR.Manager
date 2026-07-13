using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.FinancialYears;

public record GetAllFinancialYearRequestDto
{
    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    [QueryFilter]
    public bool? IsActive { get; init; } = true;

    [QueryFilter]
    public int? DepartmentId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
