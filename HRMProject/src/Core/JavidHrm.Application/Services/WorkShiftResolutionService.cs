using JavidHrm.Application.Contracts;
using JavidHrm.Domain.Common;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Services;

public class WorkShiftResolutionService(
    IEmployeeRepository employeeRepository,
    IDepartmentRepository departmentRepository,
    IWorkShiftRepository workShiftRepository,
    IEmployeeShiftScheduleRepository employeeShiftScheduleRepository)
    : IWorkShiftResolutionService
{
    public async Task<WorkShift?> ResolveForEmployeeAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default)
    {
        var schedule = await employeeShiftScheduleRepository.FindActiveForDateAsync(
            employeeId,
            workDate,
            cancellationToken);
        if (schedule is not null)
        {
            var scheduledShift = await workShiftRepository.FindAsync(schedule.WorkShiftId, cancellationToken);
            if (scheduledShift is { IsActive: true })
                return scheduledShift;
        }

        var employee = await employeeRepository.FindAsync(employeeId, cancellationToken);
        if (employee is null)
            return null;

        if (employee.WorkShiftId is not null)
        {
            var employeeShift = await workShiftRepository.FindAsync(employee.WorkShiftId.Value, cancellationToken);
            if (employeeShift is { IsActive: true })
                return employeeShift;
        }

        var department = await departmentRepository.FindAsync(employee.DepartmentId, cancellationToken);
        if (department?.DefaultWorkShiftId is not null)
        {
            var departmentShift = await workShiftRepository.FindAsync(
                department.DefaultWorkShiftId.Value,
                cancellationToken);
            if (departmentShift is { IsActive: true })
                return departmentShift;
        }

        return null;
    }
}

public class AttendanceMetricsService : IAttendanceMetricsService
{
    private static readonly TimeSpan FallbackLateThreshold = TimeSpan.FromHours(9);

    public AttendanceCheckInMetrics EvaluateCheckIn(WorkShift? shift, DateTime checkInUtc, DateTime workDate)
    {
        if (shift is null)
            return EvaluateCheckInWithoutShift(checkInUtc);

        var shiftStartUtc = WorkShiftTimeCalculator.GetShiftStartUtc(workDate, shift);
        var graceEndUtc = shiftStartUtc.AddMinutes(shift.GraceMinutes);
        var lateMinutes = checkInUtc > graceEndUtc
            ? Math.Max(0, (int)Math.Ceiling((checkInUtc - shiftStartUtc).TotalMinutes) - shift.GraceMinutes)
            : 0;

        return new AttendanceCheckInMetrics
        {
            Status = lateMinutes > 0 ? AttendanceStatus.Late : AttendanceStatus.Present,
            WorkShiftId = shift.Id,
            LateMinutes = lateMinutes
        };
    }

    public AttendanceCheckOutMetrics EvaluateCheckOut(
        WorkShift? shift,
        DateTime workDate,
        DateTime checkInUtc,
        DateTime checkOutUtc,
        AttendanceStatus checkInStatus,
        int lateMinutes)
    {
        var grossWorkedMinutes = Math.Max(0, (int)Math.Floor((checkOutUtc - checkInUtc).TotalMinutes));

        if (shift is null)
        {
            return new AttendanceCheckOutMetrics
            {
                Status = checkInStatus,
                WorkedMinutes = grossWorkedMinutes
            };
        }

        var breakMinutes = grossWorkedMinutes >= shift.GetExpectedWorkMinutes() / 2
            ? shift.BreakMinutes
            : 0;
        var workedMinutes = Math.Max(0, grossWorkedMinutes - breakMinutes);
        var expectedMinutes = shift.GetExpectedWorkMinutes();
        var overtimeMinutes = Math.Max(0, workedMinutes - expectedMinutes);

        var shiftEndUtc = WorkShiftTimeCalculator.GetShiftEndUtc(workDate, shift);
        var earlyThresholdUtc = shiftEndUtc.AddMinutes(-shift.EarlyLeaveGraceMinutes);
        var earlyLeaveMinutes = checkOutUtc < earlyThresholdUtc
            ? Math.Max(0, (int)Math.Ceiling((shiftEndUtc - checkOutUtc).TotalMinutes) - shift.EarlyLeaveGraceMinutes)
            : 0;

        var status = checkInStatus;
        if (earlyLeaveMinutes > 0 && status == AttendanceStatus.Present)
            status = AttendanceStatus.EarlyLeave;

        return new AttendanceCheckOutMetrics
        {
            Status = status,
            EarlyLeaveMinutes = earlyLeaveMinutes,
            OvertimeMinutes = overtimeMinutes,
            WorkedMinutes = workedMinutes
        };
    }

    private static AttendanceCheckInMetrics EvaluateCheckInWithoutShift(DateTime checkInUtc)
    {
        var localTime = OrganizationTime.ToLocal(checkInUtc).TimeOfDay;
        var isLate = localTime > FallbackLateThreshold;
        return new AttendanceCheckInMetrics
        {
            Status = isLate ? AttendanceStatus.Late : AttendanceStatus.Present,
            LateMinutes = isLate ? Math.Max(1, (int)Math.Ceiling((localTime - FallbackLateThreshold).TotalMinutes)) : 0
        };
    }
}
