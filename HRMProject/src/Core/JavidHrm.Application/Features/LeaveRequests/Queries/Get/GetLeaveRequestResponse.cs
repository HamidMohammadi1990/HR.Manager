using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record GetLeaveRequestResponse
{
    [JsonConverter(typeof(LeaveRequestEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string DepartmentName { get; init; } = default!;
    public string EmployeeCode { get; init; } = default!;
    public LeaveType LeaveType { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public LeaveRequestStatus Status { get; init; }
    public string Reason { get; init; } = default!;
    public DateTime CreatedOnUtc { get; init; }
}
