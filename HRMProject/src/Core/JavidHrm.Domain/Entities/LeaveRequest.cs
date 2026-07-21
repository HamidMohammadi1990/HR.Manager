using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class LeaveRequest : BaseEntity
{
    public int EmployeeId { get; private set; }
    public int LeaveTypeDefinitionId { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public LeaveRequestStatus Status { get; private set; }
    public string Reason { get; private set; } = default!;
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;
    public int? CurrentApprovalStepOrder { get; private set; }
    public int? TotalApprovalSteps { get; private set; }
    public int? SubmittedByUserId { get; private set; }

    public Employee Employee { get; private set; } = default!;
    public LeaveTypeDefinition LeaveTypeDefinition { get; private set; } = default!;
    public ICollection<LeaveRequestApprovalStep> ApprovalSteps { get; private set; } = [];

    public static LeaveRequest Create(
        int employeeId,
        int leaveTypeDefinitionId,
        LeaveTypeUnit unit,
        DateTime startDate,
        DateTime endDate,
        LeaveRequestStatus status,
        string reason)
    {
        var (normalizedStart, normalizedEnd) = NormalizeDates(unit, startDate, endDate);
        return new()
        {
            EmployeeId = employeeId,
            LeaveTypeDefinitionId = leaveTypeDefinitionId,
            StartDate = normalizedStart,
            EndDate = normalizedEnd,
            Status = status,
            Reason = reason
        };
    }

    public void Update(
        int employeeId,
        int leaveTypeDefinitionId,
        LeaveTypeUnit unit,
        DateTime startDate,
        DateTime endDate,
        LeaveRequestStatus status,
        string reason)
    {
        var (normalizedStart, normalizedEnd) = NormalizeDates(unit, startDate, endDate);
        EmployeeId = employeeId;
        LeaveTypeDefinitionId = leaveTypeDefinitionId;
        StartDate = normalizedStart;
        EndDate = normalizedEnd;
        Status = status;
        Reason = reason;
    }

    private static (DateTime Start, DateTime End) NormalizeDates(
        LeaveTypeUnit unit,
        DateTime startDate,
        DateTime endDate)
        => unit == LeaveTypeUnit.Hour
            ? (startDate, endDate)
            : (startDate.Date, endDate.Date);

    public void BeginApprovalWorkflow(int totalSteps, int? submittedByUserId)
    {
        TotalApprovalSteps = totalSteps;
        CurrentApprovalStepOrder = totalSteps > 0 ? 1 : null;
        SubmittedByUserId = submittedByUserId;
        Status = LeaveRequestStatus.Pending;
    }

    public void AdvanceApprovalStep()
    {
        if (CurrentApprovalStepOrder is null || TotalApprovalSteps is null)
            return;

        if (CurrentApprovalStepOrder < TotalApprovalSteps)
            CurrentApprovalStepOrder++;
        else
            CurrentApprovalStepOrder = null;
    }

    public void ClearApprovalWorkflow()
    {
        CurrentApprovalStepOrder = null;
        TotalApprovalSteps = null;
    }

    public void Approve()
    {
        Status = LeaveRequestStatus.Approved;
        CurrentApprovalStepOrder = null;
    }

    public void Reject()
    {
        Status = LeaveRequestStatus.Rejected;
        CurrentApprovalStepOrder = null;
    }
}
