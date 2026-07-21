using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

public class UpdateLeaveTypeDefinitionHandler
    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateLeaveTypeDefinitionRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)
    {
        var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(request.Id, cancellationToken);
        if (leaveTypeDefinition is null)
            return ErrorModel.Create("InvalidId");

        leaveTypeDefinition.Update(
            request.Code.Trim(),
            request.Name.Trim(),
            request.Description?.Trim(),
            request.Category,
            request.Unit,
            request.IsPaid,
            request.IsActive,
            request.AffectsLeaveBalance,
            request.RequiresApproval,
            request.DefaultAnnualAllowance,
            request.MaxPerYear,
            request.MaxPerRequest,
            request.MinNoticeDays,
            request.AllowNegativeBalance,
            request.CarryForwardEnabled,
            request.MaxCarryForwardDays,
            request.IncludeWeekends,
            request.IncludeHolidays,
            request.SortOrder,
            request.Color?.Trim());

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
