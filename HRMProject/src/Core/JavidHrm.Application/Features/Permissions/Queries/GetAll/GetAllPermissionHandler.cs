using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Permissions.Queries;

public class GetAllPermissionHandler
    (IPermissionRepository permissionRepository, IPermissionMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllPermissionRequest, OperationResult<PagedResult<GetAllPermissionResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllPermissionResponse>>> Handle(GetAllPermissionRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Permission>();
        var permissions = await permissionRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(permissions);
        return result;
    }
}