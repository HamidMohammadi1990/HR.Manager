using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public record CreateAttendanceRecordRequest : IRequest<OperationResult<CreateAttendanceRecordResponse>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public DateTime WorkDate { get; init; }
    public DateTime? CheckInUtc { get; init; }
    public DateTime? CheckOutUtc { get; init; }
    public AttendanceStatus Status { get; init; }
}
