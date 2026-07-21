using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class LeaveRequestApprovalStep : BaseEntity
{
    public int LeaveRequestId { get; private set; }
    public int StepOrder { get; private set; }
    public int? ApproverEmployeeId { get; private set; }
    public LeaveApprovalStepStatus Status { get; private set; } = LeaveApprovalStepStatus.Pending;
    public string? Comment { get; private set; }
    public DateTime? ActionedAtUtc { get; private set; }
    public int? ActionedByUserId { get; private set; }

    public LeaveRequest LeaveRequest { get; private set; } = default!;
    public Employee? ApproverEmployee { get; private set; }

    public static LeaveRequestApprovalStep Create(
        int leaveRequestId,
        int stepOrder,
        int? approverEmployeeId)
        => new()
        {
            LeaveRequestId = leaveRequestId,
            StepOrder = stepOrder,
            ApproverEmployeeId = approverEmployeeId,
            Status = LeaveApprovalStepStatus.Pending
        };

    public void Approve(int actionedByUserId, string? comment)
    {
        Status = LeaveApprovalStepStatus.Approved;
        ActionedByUserId = actionedByUserId;
        ActionedAtUtc = DateTime.UtcNow;
        Comment = string.IsNullOrWhiteSpace(comment) ? null : comment.Trim();
    }

    public void Reject(int actionedByUserId, string? comment)
    {
        Status = LeaveApprovalStepStatus.Rejected;
        ActionedByUserId = actionedByUserId;
        ActionedAtUtc = DateTime.UtcNow;
        Comment = string.IsNullOrWhiteSpace(comment) ? null : comment.Trim();
    }

    public void Skip()
        => Status = LeaveApprovalStepStatus.Skipped;
}
