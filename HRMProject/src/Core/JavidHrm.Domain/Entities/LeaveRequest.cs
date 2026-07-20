using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class LeaveRequest : BaseEntity
{
    public int EmployeeId { get; private set; }
    public LeaveType LeaveType { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public LeaveRequestStatus Status { get; private set; }
    public string Reason { get; private set; } = default!;
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Employee Employee { get; private set; } = default!;

    public static LeaveRequest Create(
        int employeeId,
        LeaveType leaveType,
        DateTime startDate,
        DateTime endDate,
        LeaveRequestStatus status,
        string reason)
    {
        var (normalizedStart, normalizedEnd) = NormalizeDates(leaveType, startDate, endDate);
        return new()
        {
            EmployeeId = employeeId,
            LeaveType = leaveType,
            StartDate = normalizedStart,
            EndDate = normalizedEnd,
            Status = status,
            Reason = reason
        };
    }

    public void Update(
        int employeeId,
        LeaveType leaveType,
        DateTime startDate,
        DateTime endDate,
        LeaveRequestStatus status,
        string reason)
    {
        var (normalizedStart, normalizedEnd) = NormalizeDates(leaveType, startDate, endDate);
        EmployeeId = employeeId;
        LeaveType = leaveType;
        StartDate = normalizedStart;
        EndDate = normalizedEnd;
        Status = status;
        Reason = reason;
    }

    private static (DateTime Start, DateTime End) NormalizeDates(
        LeaveType leaveType,
        DateTime startDate,
        DateTime endDate)
        => leaveType == LeaveType.Hourly
            ? (startDate, endDate)
            : (startDate.Date, endDate.Date);

    public void Approve() => Status = LeaveRequestStatus.Approved;

    public void Reject() => Status = LeaveRequestStatus.Rejected;
}
