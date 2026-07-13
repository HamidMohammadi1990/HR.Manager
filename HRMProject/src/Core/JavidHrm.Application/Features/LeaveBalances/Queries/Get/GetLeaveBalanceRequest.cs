using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public record GetLeaveBalanceRequest : IRequest<OperationResult<GetLeaveBalanceResponse?>>
{
    [JsonConverter(typeof(LeaveBalanceEncryptor))]
    public int Id { get; init; }
}
