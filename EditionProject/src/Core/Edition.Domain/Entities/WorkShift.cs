using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class WorkShift : BaseEntity
{
    public string Name { get; private set; } = default!;
    public TimeOnly StartTime { get; private set; }
    public TimeOnly EndTime { get; private set; }
    public int BreakMinutes { get; private set; }
    public bool IsActive { get; private set; }
    public string? Description { get; private set; }

    public static WorkShift Create(
        string name,
        TimeOnly startTime,
        TimeOnly endTime,
        int breakMinutes,
        bool isActive,
        string? description)
        => new()
        {
            Name = name,
            StartTime = startTime,
            EndTime = endTime,
            BreakMinutes = breakMinutes,
            IsActive = isActive,
            Description = description
        };

    public void Update(
        string name,
        TimeOnly startTime,
        TimeOnly endTime,
        int breakMinutes,
        bool isActive,
        string? description)
    {
        Name = name;
        StartTime = startTime;
        EndTime = endTime;
        BreakMinutes = breakMinutes;
        IsActive = isActive;
        Description = description;
    }
}
