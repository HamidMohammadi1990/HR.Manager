using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Employees;

public record GetAllEmployeeRequestDto
{
    [QueryFilter(MemberPath = "employee.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "employee.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "employee.ManagerId")]
    public int? ManagerId { get; init; }

    [QueryFilter(MemberPath = "employee.EmployeeCode")]
    public string? EmployeeCode { get; init; }

    [QueryFilter(MemberPath = "employee.JobTitle", Operator = FilterOperator.Contains)]
    public string? JobTitle { get; init; }

    [QueryFilter(MemberPath = "user.FirstName", Operator = FilterOperator.Contains)]
    public string? FirstName { get; init; }

    [QueryFilter(MemberPath = "user.LastName", Operator = FilterOperator.Contains)]
    public string? LastName { get; init; }

    [QueryFilter(MemberPath = "employee.IsActive")]
    public bool? IsActive { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
