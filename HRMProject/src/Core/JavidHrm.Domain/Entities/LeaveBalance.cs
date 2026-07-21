using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class LeaveBalance : BaseEntity
{
    public int EmployeeId { get; private set; }
    public int LeaveTypeDefinitionId { get; private set; }
    public int Year { get; private set; }
    public decimal TotalDays { get; private set; }
    public decimal UsedDays { get; private set; }

    public Employee Employee { get; private set; } = default!;
    public LeaveTypeDefinition LeaveTypeDefinition { get; private set; } = default!;

    public decimal RemainingDays => TotalDays - UsedDays;

    public static LeaveBalance Create(
        int employeeId,
        int leaveTypeDefinitionId,
        int year,
        decimal totalDays,
        decimal usedDays)
        => new()
        {
            EmployeeId = employeeId,
            LeaveTypeDefinitionId = leaveTypeDefinitionId,
            Year = year,
            TotalDays = totalDays,
            UsedDays = usedDays
        };

    public void Update(
        int employeeId,
        int leaveTypeDefinitionId,
        int year,
        decimal totalDays,
        decimal usedDays)
    {
        EmployeeId = employeeId;
        LeaveTypeDefinitionId = leaveTypeDefinitionId;
        Year = year;
        TotalDays = totalDays;
        UsedDays = usedDays;
    }

    public void UseDays(decimal days) => UsedDays += days;
}
