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
        => new()
        {
            EmployeeId = employeeId,
            LeaveType = leaveType,
            StartDate = startDate.Date,
            EndDate = endDate.Date,
            Status = status,
            Reason = reason
        };

    public void Update(
        int employeeId,
        LeaveType leaveType,
        DateTime startDate,
        DateTime endDate,
        LeaveRequestStatus status,
        string reason)
    {
        EmployeeId = employeeId;
        LeaveType = leaveType;
        StartDate = startDate.Date;
        EndDate = endDate.Date;
        Status = status;
        Reason = reason;
    }

    public void Approve() => Status = LeaveRequestStatus.Approved;

    public void Reject() => Status = LeaveRequestStatus.Rejected;
}
