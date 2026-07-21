using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetEmployeeLeaveBalanceHandler
    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,
     ILeaveBalanceService leaveBalanceService,
     IUnitOfWork uow)
    : IRequestHandler<GetEmployeeLeaveBalanceRequest, OperationResult<GetEmployeeLeaveBalanceResponse?>>
{
    public async Task<OperationResult<GetEmployeeLeaveBalanceResponse?>> Handle(
        GetEmployeeLeaveBalanceRequest request,
        CancellationToken cancellationToken)
    {
        var leaveTypeDefinition = await leaveTypeDefinitionRepository.GetAsNoTrackingAsync(
            request.LeaveTypeDefinitionId,
            cancellationToken);
        if (leaveTypeDefinition is null || !leaveTypeDefinition.IsActive)
            return ErrorModel.Create("InvalidId");

        if (!leaveTypeDefinition.AffectsLeaveBalance)
        {
            return new GetEmployeeLeaveBalanceResponse
            {
                EmployeeId = request.EmployeeId,
                LeaveTypeDefinitionId = leaveTypeDefinition.Id,
                LeaveTypeName = leaveTypeDefinition.Name,
                AffectsLeaveBalance = false,
                Year = request.Year ?? DateTime.UtcNow.Year,
                TotalDays = 0,
                UsedDays = 0,
                RemainingDays = 0
            };
        }

        var year = request.Year ?? DateTime.UtcNow.Year;
        var balance = await leaveBalanceService.EnsureAnnualBalanceAsync(
            request.EmployeeId,
            leaveTypeDefinition,
            year,
            cancellationToken);

        if (balance is null)
            return (GetEmployeeLeaveBalanceResponse?)null;

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<GetEmployeeLeaveBalanceResponse?>();

        return new GetEmployeeLeaveBalanceResponse
        {
            Id = balance.Id,
            EmployeeId = balance.EmployeeId,
            LeaveTypeDefinitionId = balance.LeaveTypeDefinitionId,
            LeaveTypeName = leaveTypeDefinition.Name,
            AffectsLeaveBalance = true,
            Year = balance.Year,
            TotalDays = balance.TotalDays,
            UsedDays = balance.UsedDays,
            RemainingDays = balance.RemainingDays
        };
    }
}
