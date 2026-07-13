using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public record UpdateWorkShiftRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int Id { get; init; }

    public string Name { get; init; } = default!;
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public int BreakMinutes { get; init; }
    public bool IsActive { get; init; }
    public string? Description { get; init; }
}
