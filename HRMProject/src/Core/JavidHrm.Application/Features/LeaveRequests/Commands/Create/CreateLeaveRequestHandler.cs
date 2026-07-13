using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class CreateLeaveRequestHandler
    (IUnitOfWork uow, ILeaveRequestRepository leaveRequestRepository)
    : IRequestHandler<CreateLeaveRequestRequest, OperationResult<CreateLeaveRequestResponse>>
{
    public async Task<OperationResult<CreateLeaveRequestResponse>> Handle(CreateLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = Domain.Entities.LeaveRequest.Create(
            request.EmployeeId,
            request.LeaveType,
            request.StartDate,
            request.EndDate,
            request.Status,
            request.Reason.Trim());

        leaveRequestRepository.Add(leaveRequest);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateLeaveRequestResponse>();

        return new CreateLeaveRequestResponse { Id = leaveRequest.Id };
    }
}
