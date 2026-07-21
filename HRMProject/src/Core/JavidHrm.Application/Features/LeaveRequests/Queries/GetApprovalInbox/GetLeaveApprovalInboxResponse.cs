using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record GetLeaveApprovalInboxResponse
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int LeaveRequestId { get; init; }

    public int StepOrder { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string EmployeeCode { get; init; } = default!;

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string DepartmentName { get; init; } = default!;

    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int LeaveTypeDefinitionId { get; init; }

    public string LeaveTypeName { get; init; } = default!;
    public LeaveTypeUnit LeaveTypeUnit { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public string Reason { get; init; } = default!;
    public DateTime CreatedOnUtc { get; init; }
    public int? CurrentApprovalStepOrder { get; init; }
    public int? TotalApprovalSteps { get; init; }
    public bool IsHrPoolStep { get; init; }
}
