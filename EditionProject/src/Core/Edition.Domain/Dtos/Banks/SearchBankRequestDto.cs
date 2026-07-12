using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Banks;

public record SearchBankRequestDto
{
    [QueryFilter(Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
