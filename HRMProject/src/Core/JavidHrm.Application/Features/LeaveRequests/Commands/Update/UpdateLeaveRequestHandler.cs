using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class UpdateLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository,
     ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,
     ILeaveBalanceService leaveBalanceService,
     IUnitOfWork uow)
    : IRequestHandler<UpdateLeaveRequestRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.FindAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return ErrorModel.Create("InvalidId");

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.LeaveTypeDefinitionId, cancellationToken);
        if (leaveTypeDefinition is null || !leaveTypeDefinition.IsActive)
            return ErrorModel.Create("InvalidId");

        var previousStatus = leaveRequest.Status;

        leaveRequest.Update(
            request.EmployeeId,
            request.LeaveTypeDefinitionId,
            leaveTypeDefinition.Unit,
            request.StartDate,
            request.EndDate,
            request.Status,
            request.Reason.Trim());

        if (previousStatus != LeaveRequestStatus.Approved && leaveRequest.Status == LeaveRequestStatus.Approved)
        {
            if (await leaveRequestRepository.HasOverlappingAsync(
                    leaveRequest.EmployeeId,
                    leaveRequest.StartDate,
                    leaveRequest.EndDate,
                    excludeLeaveRequestId: leaveRequest.Id,
                    cancellationToken))
                return ErrorModel.Create(MessageKeys.OverlappingLeavePeriod);

            var deductResult = await leaveBalanceService.DeductForApprovedLeaveAsync(
                leaveRequest,
                leaveTypeDefinition,
                cancellationToken);
            if (!deductResult.IsSuccess)
                return deductResult;
        }

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
