using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class AttendanceRecord : BaseEntity
{
    public int EmployeeId { get; private set; }
    public DateTime WorkDate { get; private set; }
    public DateTime? CheckInUtc { get; private set; }
    public DateTime? CheckOutUtc { get; private set; }
    public AttendanceStatus Status { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Employee Employee { get; private set; } = default!;

    public static AttendanceRecord Create(
        int employeeId,
        DateTime workDate,
        DateTime? checkInUtc,
        DateTime? checkOutUtc,
        AttendanceStatus status)
        => new()
        {
            EmployeeId = employeeId,
            WorkDate = workDate.Date,
            CheckInUtc = checkInUtc,
            CheckOutUtc = checkOutUtc,
            Status = status
        };

    public void Update(
        int employeeId,
        DateTime workDate,
        DateTime? checkInUtc,
        DateTime? checkOutUtc,
        AttendanceStatus status)
    {
        EmployeeId = employeeId;
        WorkDate = workDate.Date;
        CheckInUtc = checkInUtc;
        CheckOutUtc = checkOutUtc;
        Status = status;
    }
}
