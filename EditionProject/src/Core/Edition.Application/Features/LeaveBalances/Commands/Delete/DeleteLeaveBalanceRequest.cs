using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public record DeleteLeaveBalanceRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(LeaveBalanceEncryptor))]
    public int Id { get; init; }
}
