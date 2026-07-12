using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public record CreateLeaveRequestResponse
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int Id { get; init; }
}
