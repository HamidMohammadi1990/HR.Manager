using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public record GetAttendanceRecordResponse
{
    [JsonConverter(typeof(AttendanceRecordEncryptor))]
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
    public DateTime WorkDate { get; init; }
    public DateTime? CheckInUtc { get; init; }
    public DateTime? CheckOutUtc { get; init; }
    public AttendanceStatus Status { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
