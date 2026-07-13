using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.WorkShifts;

public record GetAllWorkShiftRequestDto
{
    [QueryFilter(MemberPath = "workShift.Name", Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    [QueryFilter(MemberPath = "workShift.IsActive")]
    public bool? IsActive { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
