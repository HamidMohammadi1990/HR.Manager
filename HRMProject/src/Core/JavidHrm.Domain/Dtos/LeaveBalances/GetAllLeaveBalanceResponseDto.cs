using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.LeaveBalances;

public class GetAllLeaveBalanceResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public string EmployeeCode { get; set; } = default!;
    public LeaveType LeaveType { get; set; }
    public int Year { get; set; }
    public decimal TotalDays { get; set; }
    public decimal UsedDays { get; set; }
    public decimal RemainingDays { get; set; }
}
