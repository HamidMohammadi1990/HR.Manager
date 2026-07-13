using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public record CheckInAttendanceRecordResponse
{
    [JsonConverter(typeof(AttendanceRecordEncryptor))]
    public int Id { get; init; }
}
