using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public record GetAllWorkShiftResponse
{
    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int Id { get; init; }

    public string Name { get; init; } = default!;
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public int BreakMinutes { get; init; }
    public int GraceMinutes { get; init; }
    public int EarlyLeaveGraceMinutes { get; init; }
    public bool IsOvernight { get; init; }
    public bool IsActive { get; init; }
    public string? Description { get; init; }
    public string? Color { get; init; }
}
