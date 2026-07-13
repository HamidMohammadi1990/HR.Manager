using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.LeaveBalances;

public record GetAllLeaveBalanceRequestDto
{
    [QueryFilter(MemberPath = "leaveBalance.EmployeeId")]
    public int? EmployeeId { get; init; }

    [QueryFilter(MemberPath = "employee.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "leaveBalance.LeaveType")]
    public LeaveType? LeaveType { get; init; }

    [QueryFilter(MemberPath = "leaveBalance.Year")]
    public int? Year { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
