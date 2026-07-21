using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Contracts;

public interface IWorkShiftResolutionService
{
    Task<WorkShift?> ResolveForEmployeeAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default);
}

public interface IAttendanceMetricsService
{
    AttendanceCheckInMetrics EvaluateCheckIn(WorkShift? shift, DateTime checkInUtc, DateTime workDate);

    AttendanceCheckOutMetrics EvaluateCheckOut(
        WorkShift? shift,
        DateTime workDate,
        DateTime checkInUtc,
        DateTime checkOutUtc,
        AttendanceStatus checkInStatus,
        int lateMinutes);
}

public sealed class AttendanceCheckInMetrics
{
    public AttendanceStatus Status { get; init; }
    public int? WorkShiftId { get; init; }
    public int LateMinutes { get; init; }
}

public sealed class AttendanceCheckOutMetrics
{
    public AttendanceStatus Status { get; init; }
    public int EarlyLeaveMinutes { get; init; }
    public int OvertimeMinutes { get; init; }
    public int WorkedMinutes { get; init; }
}
