using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class AttendanceRecord : BaseEntity
{
    public int EmployeeId { get; private set; }
    public DateTime WorkDate { get; private set; }
    public int? WorkShiftId { get; private set; }
    public DateTime? CheckInUtc { get; private set; }
    public DateTime? CheckOutUtc { get; private set; }
    public AttendanceStatus Status { get; private set; }
    public int LateMinutes { get; private set; }
    public int EarlyLeaveMinutes { get; private set; }
    public int OvertimeMinutes { get; private set; }
    public int WorkedMinutes { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Employee Employee { get; private set; } = default!;
    public WorkShift? WorkShift { get; private set; }

    public static AttendanceRecord Create(
        int employeeId,
        DateTime workDate,
        int? workShiftId,
        DateTime? checkInUtc,
        DateTime? checkOutUtc,
        AttendanceStatus status,
        int lateMinutes = 0,
        int earlyLeaveMinutes = 0,
        int overtimeMinutes = 0,
        int workedMinutes = 0)
        => new()
        {
            EmployeeId = employeeId,
            WorkDate = workDate.Date,
            WorkShiftId = workShiftId,
            CheckInUtc = checkInUtc,
            CheckOutUtc = checkOutUtc,
            Status = status,
            LateMinutes = lateMinutes,
            EarlyLeaveMinutes = earlyLeaveMinutes,
            OvertimeMinutes = overtimeMinutes,
            WorkedMinutes = workedMinutes
        };

    public void Update(
        int employeeId,
        DateTime workDate,
        int? workShiftId,
        DateTime? checkInUtc,
        DateTime? checkOutUtc,
        AttendanceStatus status,
        int lateMinutes,
        int earlyLeaveMinutes,
        int overtimeMinutes,
        int workedMinutes)
    {
        EmployeeId = employeeId;
        WorkDate = workDate.Date;
        WorkShiftId = workShiftId;
        CheckInUtc = checkInUtc;
        CheckOutUtc = checkOutUtc;
        Status = status;
        LateMinutes = lateMinutes;
        EarlyLeaveMinutes = earlyLeaveMinutes;
        OvertimeMinutes = overtimeMinutes;
        WorkedMinutes = workedMinutes;
    }

    public void RegisterCheckIn(
        DateTime checkInUtc,
        AttendanceStatus status,
        int? workShiftId,
        int lateMinutes)
    {
        CheckInUtc = checkInUtc;
        Status = status;
        WorkShiftId = workShiftId;
        LateMinutes = lateMinutes;
    }

    public void RegisterCheckOut(
        DateTime checkOutUtc,
        AttendanceStatus status,
        int earlyLeaveMinutes,
        int overtimeMinutes,
        int workedMinutes)
    {
        CheckOutUtc = checkOutUtc;
        Status = status;
        EarlyLeaveMinutes = earlyLeaveMinutes;
        OvertimeMinutes = overtimeMinutes;
        WorkedMinutes = workedMinutes;
    }

    public void ApplyMetrics(
        AttendanceStatus status,
        int lateMinutes,
        int earlyLeaveMinutes,
        int overtimeMinutes,
        int workedMinutes)
    {
        Status = status;
        LateMinutes = lateMinutes;
        EarlyLeaveMinutes = earlyLeaveMinutes;
        OvertimeMinutes = overtimeMinutes;
        WorkedMinutes = workedMinutes;
    }
}
