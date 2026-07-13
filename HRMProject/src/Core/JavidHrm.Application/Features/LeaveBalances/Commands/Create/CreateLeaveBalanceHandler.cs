using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class CreateLeaveBalanceHandler
    (IUnitOfWork uow, ILeaveBalanceRepository leaveBalanceRepository)
    : IRequestHandler<CreateLeaveBalanceRequest, OperationResult<CreateLeaveBalanceResponse>>
{
    public async Task<OperationResult<CreateLeaveBalanceResponse>> Handle(CreateLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var leaveBalance = Domain.Entities.LeaveBalance.Create(
            request.EmployeeId,
            request.LeaveType,
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
