using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class ApproveLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository,
     ILeaveApprovalWorkflowService leaveApprovalWorkflowService,
     ICurrentUserContext currentUserContext,
     IUnitOfWork uow)
    : IRequestHandler<ApproveLeaveRequestRequest, OperationResult>
{
    public async Task<OperationResult> Handle(ApproveLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.FindWithApprovalStepsAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (leaveRequest.Status != LeaveRequestStatus.Pending)
            return ErrorModel.Create(MessageKeys.LeaveRequestNotPending);

        if (await leaveRequestRepository.HasOverlappingAsync(
                leaveRequest.EmployeeId,
                leaveRequest.StartDate,
                leaveRequest.EndDate,
                excludeLeaveRequestId: leaveRequest.Id,
                cancellationToken))
            return ErrorModel.Create(MessageKeys.OverlappingLeavePeriod);

        var result = await leaveApprovalWorkflowService.ApproveCurrentStepAsync(
            leaveRequest,
            currentUserContext.UserId,
            request.Comment,
            cancellationToken);
        if (!result.IsSuccess)
            return result;

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
