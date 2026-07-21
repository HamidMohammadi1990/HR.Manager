using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Common;

public static class OrganizationTime
{
    public static readonly TimeSpan DefaultOffset = TimeSpan.FromHours(3.5);

    public static DateTime ToLocal(DateTime utc, TimeSpan? offset = null)
        => utc.Add(offset ?? DefaultOffset);

    public static DateTime ToUtc(DateTime local, TimeSpan? offset = null)
        => local.Subtract(offset ?? DefaultOffset);

    public static DateTime CombineLocalDateAndTime(DateTime workDate, TimeOnly time, TimeSpan? offset = null)
    {
        var local = workDate.Date.Add(time.ToTimeSpan());
        return ToUtc(local, offset);
    }
}

public static class WorkShiftTimeCalculator
{
    public static DateTime GetShiftStartUtc(DateTime workDate, WorkShift shift, TimeSpan? offset = null)
        => OrganizationTime.CombineLocalDateAndTime(workDate, shift.StartTime, offset);

    public static DateTime GetShiftEndUtc(DateTime workDate, WorkShift shift, TimeSpan? offset = null)
    {
        var endDate = shift.IsOvernight ? workDate.Date.AddDays(1) : workDate.Date;
        return OrganizationTime.CombineLocalDateAndTime(endDate, shift.EndTime, offset);
    }

    public static int GetExpectedWorkMinutes(WorkShift shift)
        => shift.GetExpectedWorkMinutes();
}
