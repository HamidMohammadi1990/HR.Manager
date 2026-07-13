using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public record GetAllPayrollEntryResponse
{
    [JsonConverter(typeof(PayrollEntryEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string DepartmentName { get; init; } = default!;
    public string EmployeeCode { get; init; } = default!;
    public int Year { get; init; }
    public int Month { get; init; }
    public decimal BaseSalary { get; init; }
    public decimal GrossAmount { get; init; }
    public decimal Deductions { get; init; }
    public decimal NetAmount { get; init; }
    public PayrollEntryStatus Status { get; init; }
    public string? Notes { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
