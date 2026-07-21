using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public record GetEmployeeLeaveBalanceRequest : IRequest<OperationResult<GetEmployeeLeaveBalanceResponse?>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int LeaveTypeDefinitionId { get; init; }

    public int? Year { get; init; }
}
