using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class WorkShift : BaseEntity
{
    public string Name { get; private set; } = default!;
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public int BreakMinutes { get; private set; }
    public int GraceMinutes { get; private set; }
    public int EarlyLeaveGraceMinutes { get; private set; }
    public bool IsOvernight { get; private set; }
    public bool IsActive { get; private set; }
    public string? Description { get; private set; }
    public string? Color { get; private set; }

    public static WorkShift Create(
        string name,
        TimeOnly startTime,
        TimeOnly endTime,
        int breakMinutes,
        int graceMinutes,
        int earlyLeaveGraceMinutes,
        bool isOvernight,
        bool isActive,
        string? description,
        string? color)
        => new()
        {
            Name = name,
            StartTime = startTime,
            EndTime = endTime,
            BreakMinutes = breakMinutes,
            GraceMinutes = graceMinutes,
            EarlyLeaveGraceMinutes = earlyLeaveGraceMinutes,
            IsOvernight = isOvernight,
            IsActive = isActive,
            Description = description,
            Color = color
        };

    public void Update(
        string name,
        TimeOnly startTime,
        TimeOnly endTime,
        int breakMinutes,
        int graceMinutes,
        int earlyLeaveGraceMinutes,
        bool isOvernight,
        bool isActive,
        string? description,
        string? color)
    {
        Name = name;
        StartTime = startTime;
        EndTime = endTime;
        BreakMinutes = breakMinutes;
        GraceMinutes = graceMinutes;
        EarlyLeaveGraceMinutes = earlyLeaveGraceMinutes;
        IsOvernight = isOvernight;
        IsActive = isActive;
        Description = description;
        Color = color;
    }

    public int GetExpectedWorkMinutes()
    {
        var gross = IsOvernight
            ? (int)(TimeSpan.FromHours(24) - StartTime.ToTimeSpan() + EndTime.ToTimeSpan()).TotalMinutes
            : (int)(EndTime.ToTimeSpan() - StartTime.ToTimeSpan()).TotalMinutes;

        return Math.Max(0, gross - BreakMinutes);
    }
}
