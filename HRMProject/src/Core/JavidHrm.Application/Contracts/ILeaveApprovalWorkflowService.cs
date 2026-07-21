using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts;

public interface ILeaveApprovalWorkflowService
{
    Task<LeaveApprovalWorkflowInitResult> InitializeWorkflowAsync(
        LeaveRequest leaveRequest,
        LeaveTypeDefinition leaveTypeDefinition,
        int? submittedByUserId,
        CancellationToken cancellationToken = default);

    Task<OperationResult> ApproveCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        string? comment,
        CancellationToken cancellationToken = default);

    Task<OperationResult> RejectCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        string? comment,
        CancellationToken cancellationToken = default);

    Task<bool> CanUserActOnCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        CancellationToken cancellationToken = default);
}

public sealed class LeaveApprovalWorkflowInitResult
{
    public bool AutoApproved { get; init; }

    public static LeaveApprovalWorkflowInitResult WorkflowStarted()
        => new() { AutoApproved = false };

    public static LeaveApprovalWorkflowInitResult AutoApprovedResult()
        => new() { AutoApproved = true };
}
