using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public record UpdateLeaveRequestRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public LeaveType LeaveType { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public LeaveRequestStatus Status { get; init; }
    public string Reason { get; init; } = default!;
}
