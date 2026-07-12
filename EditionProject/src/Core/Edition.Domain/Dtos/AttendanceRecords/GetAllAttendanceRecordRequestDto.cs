using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.AttendanceRecords;

public record GetAllAttendanceRecordRequestDto
{
    [QueryFilter(MemberPath = "record.EmployeeId")]
    public int? EmployeeId { get; init; }

    [QueryFilter(MemberPath = "employee.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "employee.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "record.WorkDate")]
    public DateTime? WorkDate { get; init; }

    [QueryFilter(MemberPath = "record.Status")]
    public AttendanceStatus? Status { get; init; }

    [QueryFilter(MemberPath = "user.FirstName", Operator = FilterOperator.Contains)]
    public string? FirstName { get; init; }

    [QueryFilter(MemberPath = "user.LastName", Operator = FilterOperator.Contains)]
    public string? LastName { get; init; }

    [QueryFilter(MemberPath = "employee.EmployeeCode")]
    public string? EmployeeCode { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
