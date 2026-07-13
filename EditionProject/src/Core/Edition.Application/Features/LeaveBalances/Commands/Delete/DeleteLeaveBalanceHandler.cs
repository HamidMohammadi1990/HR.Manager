using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class DeleteLeaveBalanceHandler
    (ILeaveBalanceRepository leaveBalanceRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteLeaveBalanceRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var leaveBalance = await leaveBalanceRepository.FindAsync(request.Id, cancellationToken);
        if (leaveBalance is null)
            return ErrorModel.Create("InvalidId");

        leaveBalanceRepository.Remove(leaveBalance);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
