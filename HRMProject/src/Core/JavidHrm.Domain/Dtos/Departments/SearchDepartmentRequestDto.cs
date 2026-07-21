using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Departments;

public record SearchDepartmentRequestDto
{
    [QueryFilter(MemberPath = "department.UserId")]
    public int? UserId { get; set; }

    [QueryFilter(MemberPath = "department.ParentDepartmentId")]
    public int? ParentDepartmentId { get; init; }

    [QueryFilter(MemberPath = "department.Name", Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    [QueryFilter(MemberPath = "department.Code")]
    public string? Code { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
