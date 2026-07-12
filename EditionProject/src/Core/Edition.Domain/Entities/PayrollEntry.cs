using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class PayrollEntry : BaseEntity
{
    public int EmployeeId { get; private set; }
    public int Year { get; private set; }
    public int Month { get; private set; }
    public decimal BaseSalary { get; private set; }
    public decimal GrossAmount { get; private set; }
    public decimal Deductions { get; private set; }
    public decimal NetAmount { get; private set; }
    public PayrollEntryStatus Status { get; private set; }
    public string? Notes { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Employee Employee { get; private set; } = default!;

    public static PayrollEntry Create(
        int employeeId,
        int year,
        int month,
        decimal baseSalary,
        decimal grossAmount,
        decimal deductions,
        decimal netAmount,
        PayrollEntryStatus status,
        string? notes)
        => new()
        {
            EmployeeId = employeeId,
            Year = year,
            Month = month,
            BaseSalary = baseSalary,
            GrossAmount = grossAmount,
            Deductions = deductions,
            NetAmount = netAmount,
            Status = status,
            Notes = notes
        };

    public void Update(
        int employeeId,
        int year,
        int month,
        decimal baseSalary,
        decimal grossAmount,
        decimal deductions,
        decimal netAmount,
        PayrollEntryStatus status,
        string? notes)
    {
        EmployeeId = employeeId;
        Year = year;
        Month = month;
        BaseSalary = baseSalary;
        GrossAmount = grossAmount;
        Deductions = deductions;
        NetAmount = netAmount;
        Status = status;
        Notes = notes;
    }
}
