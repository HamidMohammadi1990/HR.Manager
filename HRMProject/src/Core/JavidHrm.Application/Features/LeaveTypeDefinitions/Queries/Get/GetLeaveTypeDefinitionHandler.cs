using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class GetLeaveTypeDefinitionHandler
    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository, ILeaveTypeDefinitionMapperService mapper)
    : IRequestHandler<GetLeaveTypeDefinitionRequest, OperationResult<GetLeaveTypeDefinitionResponse?>>
{
    public async Task<OperationResult<GetLeaveTypeDefinitionResponse?>> Handle(GetLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)
    {
        var leaveTypeDefinition = await leaveTypeDefinitionRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (leaveTypeDefinition is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(leaveTypeDefinition);
    }
}
