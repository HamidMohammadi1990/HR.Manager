using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class EmployeeShiftSchedule : BaseEntity
{
    public int EmployeeId { get; private set; }
    public int WorkShiftId { get; private set; }
    public DateTime EffectiveFrom { get; private set; }
    public DateTime? EffectiveTo { get; private set; }
    public string? Note { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Employee Employee { get; private set; } = default!;
    public WorkShift WorkShift { get; private set; } = default!;

    public static EmployeeShiftSchedule Create(
        int employeeId,
        int workShiftId,
        DateTime effectiveFrom,
        DateTime? effectiveTo,
        string? note)
        => new()
        {
            EmployeeId = employeeId,
            WorkShiftId = workShiftId,
            EffectiveFrom = effectiveFrom.Date,
            EffectiveTo = effectiveTo?.Date,
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim()
        };

    public void Update(
        int workShiftId,
        DateTime effectiveFrom,
        DateTime? effectiveTo,
        string? note)
    {
        WorkShiftId = workShiftId;
        EffectiveFrom = effectiveFrom.Date;
        EffectiveTo = effectiveTo?.Date;
        Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
    }

    public bool CoversDate(DateTime workDate)
    {
        var date = workDate.Date;
        return date >= EffectiveFrom && (EffectiveTo is null || date <= EffectiveTo.Value);
    }
}
