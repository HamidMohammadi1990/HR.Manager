using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.PayrollEntries;

public class GetAllPayrollEntryResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public string EmployeeCode { get; set; } = default!;
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetAmount { get; set; }
    public PayrollEntryStatus Status { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
