using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record GetLeaveRequestRequest : IRequest<OperationResult<GetLeaveRequestResponse?>>
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int Id { get; init; }
}
