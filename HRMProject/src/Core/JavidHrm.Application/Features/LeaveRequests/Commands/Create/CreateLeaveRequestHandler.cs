using JavidHrm.Common.Models;

using JavidHrm.Domain.Enums;

using JavidHrm.Domain.Repositories;

using JavidHrm.Application.Contracts;

using JavidHrm.Application.Contracts.Persistence;



namespace JavidHrm.Application.Features.LeaveRequests.Commands;



public class CreateLeaveRequestHandler

    (IUnitOfWork uow,

     ILeaveRequestRepository leaveRequestRepository,

     ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,

     ILeaveApprovalWorkflowService leaveApprovalWorkflowService,

     ILeaveBalanceService leaveBalanceService,

     ICurrentUserContext currentUserContext)

    : IRequestHandler<CreateLeaveRequestRequest, OperationResult<CreateLeaveRequestResponse>>

{

    public async Task<OperationResult<CreateLeaveRequestResponse>> Handle(CreateLeaveRequestRequest request, CancellationToken cancellationToken)

    {

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.LeaveTypeDefinitionId, cancellationToken);

        if (leaveTypeDefinition is null || !leaveTypeDefinition.IsActive)

            return ErrorModel.Create("InvalidId");



        var leaveRequest = Domain.Entities.LeaveRequest.Create(

            request.EmployeeId,

            request.LeaveTypeDefinitionId,

            leaveTypeDefinition.Unit,

            request.StartDate,

            request.EndDate,

            LeaveRequestStatus.Pending,

            request.Reason.Trim());



        leaveRequestRepository.Add(leaveRequest);



        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);

        if (!saveChangesResult.IsSuccess)

            return saveChangesResult.ToGenericFailure<CreateLeaveRequestResponse>();



        var submittedByUserId = currentUserContext.IsAuthenticated ? currentUserContext.UserId : (int?)null;

        var initResult = await leaveApprovalWorkflowService.InitializeWorkflowAsync(

            leaveRequest,

            leaveTypeDefinition,

            submittedByUserId,

            cancellationToken);



        if (initResult.AutoApproved)

        {

            var deductResult = await leaveBalanceService.DeductForApprovedLeaveAsync(

                leaveRequest,

                leaveTypeDefinition,

                cancellationToken);

            if (!deductResult.IsSuccess)

                return deductResult.ToGenericFailure<CreateLeaveRequestResponse>();

        }



        saveChangesResult = await uow.SaveChangesAsync(cancellationToken);

        if (!saveChangesResult.IsSuccess)

            return saveChangesResult.ToGenericFailure<CreateLeaveRequestResponse>();



        return new CreateLeaveRequestResponse { Id = leaveRequest.Id };

    }

}

