using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public record ApproveLeaveRequestRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int Id { get; init; }

    public string? Comment { get; init; }
}
