using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public record CreatePayrollEntryRequest : IRequest<OperationResult<CreatePayrollEntryResponse>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public int Year { get; init; }
    public int Month { get; init; }
    public decimal BaseSalary { get; init; }
    public decimal GrossAmount { get; init; }
    public decimal Deductions { get; init; }
    public decimal NetAmount { get; init; }
    public PayrollEntryStatus Status { get; init; } = PayrollEntryStatus.Draft;
    public string? Notes { get; init; }
}
