using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public record GetAttendanceRecordRequest : IRequest<OperationResult<GetAttendanceRecordResponse?>>
{
    [JsonConverter(typeof(AttendanceRecordEncryptor))]
    public int Id { get; init; }
}
