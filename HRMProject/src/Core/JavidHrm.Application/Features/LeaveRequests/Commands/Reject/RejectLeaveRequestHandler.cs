using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class RejectLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository,
     ILeaveApprovalWorkflowService leaveApprovalWorkflowService,
     ICurrentUserContext currentUserContext,
     IUnitOfWork uow)
    : IRequestHandler<RejectLeaveRequestRequest, OperationResult>
{
    public async Task<OperationResult> Handle(RejectLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.FindWithApprovalStepsAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (leaveRequest.Status != LeaveRequestStatus.Pending)
            return ErrorModel.Create(MessageKeys.LeaveRequestNotPending);

        var result = await leaveApprovalWorkflowService.RejectCurrentStepAsync(
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
