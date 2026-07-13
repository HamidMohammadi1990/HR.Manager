using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class UpdateLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateLeaveRequestRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.FindAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return ErrorModel.Create("InvalidId");

        leaveRequest.Update(
            request.EmployeeId,
            request.LeaveType,
            request.StartDate,
            request.EndDate,
            request.Status,
            request.Reason.Trim());

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
