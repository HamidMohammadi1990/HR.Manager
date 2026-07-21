using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record LeaveRequestApprovalStepResponse
{
    public int StepOrder { get; init; }

    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? ApproverEmployeeId { get; init; }

    public string? ApproverFirstName { get; init; }
    public string? ApproverLastName { get; init; }
    public string? ApproverJobTitle { get; init; }
    public bool IsHrPool { get; init; }
    public LeaveApprovalStepStatus Status { get; init; }
    public string? Comment { get; init; }
    public DateTime? ActionedAtUtc { get; init; }
    public bool IsCurrent { get; init; }
}
