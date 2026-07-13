using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class LeaveBalance : BaseEntity
{
    public int EmployeeId { get; private set; }
    public LeaveType LeaveType { get; private set; }
    public int Year { get; private set; }
    public decimal TotalDays { get; private set; }
    public decimal UsedDays { get; private set; }

    public Employee Employee { get; private set; } = default!;

    public static LeaveBalance Create(
        int employeeId,
        LeaveType leaveType,
        int year,
        decimal totalDays,
        decimal usedDays)
        => new()
        {
            EmployeeId = employeeId,
            LeaveType = leaveType,
            Year = year,
            TotalDays = totalDays,
            UsedDays = usedDays
        };

    public void Update(
        int employeeId,
        LeaveType leaveType,
        int year,
        decimal totalDays,
        decimal usedDays)
    {
        EmployeeId = employeeId;
        LeaveType = leaveType;
        Year = year;
        TotalDays = totalDays;
        UsedDays = usedDays;
    }
}
