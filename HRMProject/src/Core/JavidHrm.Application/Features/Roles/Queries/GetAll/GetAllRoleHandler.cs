using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Roles.Queries;

public class GetAllRoleHandler
    (IRoleRepository roleRepository, IRoleMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllRoleRequest, OperationResult<PagedResult<GetAllRoleResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllRoleResponse>>> Handle(GetAllRoleRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Role>();
        var roles = await roleRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(roles);
        return result;
    }
}