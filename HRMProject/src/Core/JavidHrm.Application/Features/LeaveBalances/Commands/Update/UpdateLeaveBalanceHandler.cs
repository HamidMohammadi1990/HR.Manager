using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class UpdateLeaveBalanceHandler
    (ILeaveBalanceRepository leaveBalanceRepository, ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateLeaveBalanceRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var leaveBalance = await leaveBalanceRepository.FindAsync(request.Id, cancellationToken);
        if (leaveBalance is null)
            return ErrorModel.Create("InvalidId");

        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.LeaveTypeDefinitionId, cancellationToken);
        if (leaveTypeDefinition is null || !leaveTypeDefinition.IsActive)
            return ErrorModel.Create("InvalidId");

        leaveBalance.Update(
            request.EmployeeId,
            request.LeaveTypeDefinitionId,
            request.Year,
            request.TotalDays,
            request.UsedDays);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
