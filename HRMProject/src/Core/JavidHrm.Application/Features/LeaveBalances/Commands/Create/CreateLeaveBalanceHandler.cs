using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class CreateLeaveBalanceHandler
    (IUnitOfWork uow, ILeaveBalanceRepository leaveBalanceRepository, ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)
    : IRequestHandler<CreateLeaveBalanceRequest, OperationResult<CreateLeaveBalanceResponse>>
{
    public async Task<OperationResult<CreateLeaveBalanceResponse>> Handle(CreateLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.LeaveTypeDefinitionId, cancellationToken);
        if (leaveTypeDefinition is null || !leaveTypeDefinition.IsActive)
            return ErrorModel.Create("InvalidId");

        var leaveBalance = Domain.Entities.LeaveBalance.Create(
            request.EmployeeId,
            request.LeaveTypeDefinitionId,
            request.Year,
            request.TotalDays,
            request.UsedDays);

        leaveBalanceRepository.Add(leaveBalance);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateLeaveBalanceResponse>();

        return new CreateLeaveBalanceResponse { Id = leaveBalance.Id };
    }
}
