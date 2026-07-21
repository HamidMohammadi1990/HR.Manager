using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class GetAllLeaveTypeDefinitionHandler
    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,
     ILeaveTypeDefinitionMapperService mapper,
     IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllLeaveTypeDefinitionRequest, OperationResult<PagedResult<GetAllLeaveTypeDefinitionResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllLeaveTypeDefinitionResponse>>> Handle(GetAllLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.LeaveTypeDefinition>();
        var leaveTypeDefinitions = await leaveTypeDefinitionRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(leaveTypeDefinitions);
    }
}
