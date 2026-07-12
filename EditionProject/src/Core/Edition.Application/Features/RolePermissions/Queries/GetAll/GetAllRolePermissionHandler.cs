using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public class GetAllRolePermissionHandler
    (IRolePermissionRepository rolePermissionRepository, IRolePermissionMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllRolePermissionRequest, OperationResult<PagedResult<GetAllRolePermissionResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllRolePermissionResponse>>> Handle(GetAllRolePermissionRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.RolePermission>();
        var rolePermissions = await rolePermissionRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(rolePermissions);
    }
}
