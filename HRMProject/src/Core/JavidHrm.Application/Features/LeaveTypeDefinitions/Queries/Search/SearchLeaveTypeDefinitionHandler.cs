using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public class SearchLeaveTypeDefinitionHandler
    (ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository,
     ILeaveTypeDefinitionMapperService mapper,
     IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<SearchLeaveTypeDefinitionRequest, OperationResult<PagedResult<SearchLeaveTypeDefinitionResponse>>>
{
    public async Task<OperationResult<PagedResult<SearchLeaveTypeDefinitionResponse>>> Handle(SearchLeaveTypeDefinitionRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        requestModel.IsActive ??= true;

        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.LeaveTypeDefinition>();
        var leaveTypeDefinitions = await leaveTypeDefinitionRepository.SearchAsync(requestModel, filter);
        return mapper.Map(leaveTypeDefinitions);
    }
}
