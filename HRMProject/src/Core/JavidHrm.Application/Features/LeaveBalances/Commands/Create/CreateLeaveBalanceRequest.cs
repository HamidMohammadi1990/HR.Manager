using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public record CreateLeaveBalanceRequest : IRequest<OperationResult<CreateLeaveBalanceResponse>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int LeaveTypeDefinitionId { get; init; }

    public int Year { get; init; }
    public decimal TotalDays { get; init; }
    public decimal UsedDays { get; init; }
}
