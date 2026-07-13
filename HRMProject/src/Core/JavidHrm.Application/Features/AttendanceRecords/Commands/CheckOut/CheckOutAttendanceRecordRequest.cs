using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public record CheckOutAttendanceRecordRequest : IRequest<OperationResult<CheckOutAttendanceRecordResponse>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public DateTime? WorkDate { get; init; }
}
