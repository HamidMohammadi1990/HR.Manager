using JavidHrm.Common.Models;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class DeleteLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteLeaveRequestRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.FindWithApprovalStepsAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return ErrorModel.Create("InvalidId");

        if (!leaveRequest.CanBeModified())
            return ErrorModel.Create(MessageKeys.LeaveRequestCannotBeModified);

        leaveRequestRepository.Remove(leaveRequest);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
