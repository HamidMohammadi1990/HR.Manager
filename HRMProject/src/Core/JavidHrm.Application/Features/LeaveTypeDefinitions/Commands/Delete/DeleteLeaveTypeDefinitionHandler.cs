using JavidHrm.Common.Models;

using JavidHrm.Domain.Repositories;

using JavidHrm.Application.Contracts.Persistence;



namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;



public class DeleteLeaveTypeDefinitionHandler

    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,

     ILeaveRequestRepository leaveRequestRepository,

     ILeaveBalanceRepository leaveBalanceRepository,

     IUnitOfWork uow)

    : IRequestHandler<DeleteLeaveTypeDefinitionRequest, OperationResult>

{

    public async Task<OperationResult> Handle(DeleteLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)

    {

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.Id, cancellationToken);

        if (leaveTypeDefinition is null)

            return ErrorModel.Create("InvalidId");



        if (await leaveRequestRepository.AnyAsync(x => x.LeaveTypeDefinitionId == request.Id, cancellationToken)

            || await leaveBalanceRepository.AnyAsync(x => x.LeaveTypeDefinitionId == request.Id, cancellationToken))

            return ErrorModel.Create("RecordInUse");



        leaveTypeDefinitionRepository.Remove(leaveTypeDefinition);



        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);

        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;

    }

}

