using JavidHrm.Application.Contracts;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Services;

public class LeaveApprovalWorkflowService(
    IEmployeeRepository employeeRepository,
    ILeaveRequestApprovalStepRepository approvalStepRepository,
    ILeaveBalanceService leaveBalanceService,
    ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,
    IAccountingService accountingService)
    : ILeaveApprovalWorkflowService
{
    public async Task<LeaveApprovalWorkflowInitResult> InitializeWorkflowAsync(
        LeaveRequest leaveRequest,
        LeaveTypeDefinition leaveTypeDefinition,
        int? submittedByUserId,
        CancellationToken cancellationToken = default)
    {
        if (!leaveTypeDefinition.RequiresApproval)
        {
            leaveRequest.ClearApprovalWorkflow();
            leaveRequest.Approve();
            return LeaveApprovalWorkflowInitResult.AutoApprovedResult();
        }

        var managerChain = await employeeRepository.GetManagerChainAsync(
            leaveRequest.EmployeeId,
            cancellationToken);

        var steps = new List<LeaveRequestApprovalStep>();

        if (managerChain.Count == 0)
        {
            steps.Add(LeaveRequestApprovalStep.Create(
                leaveRequest.Id,
                stepOrder: 1,
                approverEmployeeId: null));
            leaveRequest.BeginApprovalWorkflow(1, submittedByUserId);
        }
        else
        {
            for (var index = 0; index < managerChain.Count; index++)
            {
                steps.Add(LeaveRequestApprovalStep.Create(
                    leaveRequest.Id,
                    stepOrder: index + 1,
                    approverEmployeeId: managerChain[index]));
            }

            leaveRequest.BeginApprovalWorkflow(managerChain.Count, submittedByUserId);
        }

        approvalStepRepository.AddRange(steps);
        return LeaveApprovalWorkflowInitResult.WorkflowStarted();
    }

    public async Task<OperationResult> ApproveCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        string? comment,
        CancellationToken cancellationToken = default)
    {
        if (leaveRequest.Status != LeaveRequestStatus.Pending)
            return ErrorModel.Create(MessageKeys.LeaveRequestNotPending);

        var currentStep = GetCurrentStep(leaveRequest);
        if (currentStep is null)
            return await ApproveLegacyRequestAsync(leaveRequest, userId, cancellationToken);

        if (!await CanUserActOnCurrentStepAsync(leaveRequest, userId, cancellationToken))
            return ErrorModel.Create(MessageKeys.LeaveApprovalUnauthorized);

        currentStep.Approve(userId, comment);

        var isFinalStep = leaveRequest.CurrentApprovalStepOrder == leaveRequest.TotalApprovalSteps;
        if (!isFinalStep)
        {
            leaveRequest.AdvanceApprovalStep();
            return OperationResult.Success();
        }

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(
            leaveRequest.LeaveTypeDefinitionId,
            cancellationToken);
        if (leaveTypeDefinition is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        leaveRequest.Approve();

        var deductResult = await leaveBalanceService.DeductForApprovedLeaveAsync(
            leaveRequest,
            leaveTypeDefinition,
            cancellationToken);
        if (!deductResult.IsSuccess)
            return deductResult;

        SkipRemainingSteps(leaveRequest);
        return OperationResult.Success();
    }

    public async Task<OperationResult> RejectCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        string? comment,
        CancellationToken cancellationToken = default)
    {
        if (leaveRequest.Status != LeaveRequestStatus.Pending)
            return ErrorModel.Create(MessageKeys.LeaveRequestNotPending);

        var currentStep = GetCurrentStep(leaveRequest);
        if (currentStep is null)
        {
            if (!await accountingService.HasPermissionAsync(userId, PermissionType.ApproveLeave))
                return ErrorModel.Create(MessageKeys.LeaveApprovalUnauthorized);

            leaveRequest.Reject();
            return OperationResult.Success();
        }

        if (!await CanUserActOnCurrentStepAsync(leaveRequest, userId, cancellationToken))
            return ErrorModel.Create(MessageKeys.LeaveApprovalUnauthorized);

        currentStep.Reject(userId, comment);
        leaveRequest.Reject();
        SkipRemainingSteps(leaveRequest, afterStepOrder: currentStep.StepOrder);

        return OperationResult.Success();
    }

    public async Task<bool> CanUserActOnCurrentStepAsync(
        LeaveRequest leaveRequest,
        int userId,
        CancellationToken cancellationToken = default)
    {
        if (leaveRequest.Status != LeaveRequestStatus.Pending)
            return false;

        var currentStep = GetCurrentStep(leaveRequest);
        if (currentStep is null)
        {
            return leaveRequest.TotalApprovalSteps is null
                   && await accountingService.HasPermissionAsync(userId, PermissionType.ApproveLeave);
        }

        if (await accountingService.HasPermissionAsync(userId, PermissionType.ManageLeave))
            return true;

        if (currentStep.ApproverEmployeeId is null)
            return await accountingService.HasPermissionAsync(userId, PermissionType.ApproveLeave);

        var actingEmployee = await employeeRepository.GetByUserIdAsync(userId, cancellationToken);
        return actingEmployee is not null && actingEmployee.Id == currentStep.ApproverEmployeeId;
    }

    private static LeaveRequestApprovalStep? GetCurrentStep(LeaveRequest leaveRequest)
    {
        if (leaveRequest.CurrentApprovalStepOrder is null)
            return null;

        return leaveRequest.ApprovalSteps
            .OrderBy(x => x.StepOrder)
            .FirstOrDefault(x =>
                x.StepOrder == leaveRequest.CurrentApprovalStepOrder &&
                x.Status == LeaveApprovalStepStatus.Pending);
    }

    private static void SkipRemainingSteps(LeaveRequest leaveRequest, int? afterStepOrder = null)
    {
        foreach (var step in leaveRequest.ApprovalSteps.Where(x => x.Status == LeaveApprovalStepStatus.Pending))
        {
            if (afterStepOrder is not null && step.StepOrder <= afterStepOrder)
                continue;

            step.Skip();
        }
    }

    private async Task<OperationResult> ApproveLegacyRequestAsync(
        LeaveRequest leaveRequest,
        int userId,
        CancellationToken cancellationToken)
    {
        if (!await accountingService.HasPermissionAsync(userId, PermissionType.ApproveLeave))
            return ErrorModel.Create(MessageKeys.LeaveApprovalUnauthorized);

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(
            leaveRequest.LeaveTypeDefinitionId,
            cancellationToken);
        if (leaveTypeDefinition is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        leaveRequest.Approve();

        return await leaveBalanceService.DeductForApprovedLeaveAsync(
            leaveRequest,
            leaveTypeDefinition,
            cancellationToken);
    }
}
