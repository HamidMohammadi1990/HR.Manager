using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public record CreateWorkShiftRequest : IRequest<OperationResult<CreateWorkShiftResponse>>
{
    public string Name { get; init; } = default!;
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public int BreakMinutes { get; init; }
    public int GraceMinutes { get; init; }
    public int EarlyLeaveGraceMinutes { get; init; }
    public bool IsOvernight { get; init; }
    public bool IsActive { get; init; } = true;
    public string? Description { get; init; }
    public string? Color { get; init; }
}
