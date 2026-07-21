using JavidHrm.Common.Models;

using JavidHrm.Domain.Repositories;

using JavidHrm.Application.Contracts.Persistence;



namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;



public class CreateLeaveTypeDefinitionHandler

    (IUnitOfWork uow, ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)

    : IRequestHandler<CreateLeaveTypeDefinitionRequest, OperationResult<CreateLeaveTypeDefinitionResponse>>

{

    public async Task<OperationResult<CreateLeaveTypeDefinitionResponse>> Handle(CreateLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)

    {

        var leaveTypeDefinition = Domain.Entities.LeaveTypeDefinition.Create(

            request.Code.Trim(),

            request.Name.Trim(),

            request.Description?.Trim(),

            request.Category,

            request.Unit,

            request.IsPaid,

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



        leaveTypeDefinitionRepository.Add(leaveTypeDefinition);



        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);

        if (!saveChangesResult.IsSuccess)

            return saveChangesResult.ToGenericFailure<CreateLeaveTypeDefinitionResponse>();



        return new CreateLeaveTypeDefinitionResponse { Id = leaveTypeDefinition.Id };

    }

}

