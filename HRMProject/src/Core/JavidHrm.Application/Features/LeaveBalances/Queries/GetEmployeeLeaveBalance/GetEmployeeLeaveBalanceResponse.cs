using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public record GetEmployeeLeaveBalanceResponse
{
    [JsonConverter(typeof(LeaveBalanceEncryptor))]
    public int? Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int LeaveTypeDefinitionId { get; init; }

    public string LeaveTypeName { get; init; } = default!;
    public bool AffectsLeaveBalance { get; init; }
    public int Year { get; init; }
    public decimal TotalDays { get; init; }
    public decimal UsedDays { get; init; }
    public decimal RemainingDays { get; init; }
}
