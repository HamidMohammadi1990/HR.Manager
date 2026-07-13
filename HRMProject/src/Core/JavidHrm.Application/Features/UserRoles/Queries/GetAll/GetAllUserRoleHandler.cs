using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.UserRoles.Queries;

public class GetAllUserRoleHandler
    (IUserRoleRepository userRoleRepository, IUserRoleMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllUserRoleRequest, OperationResult<PagedResult<GetAllUserRoleResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllUserRoleResponse>>> Handle(GetAllUserRoleRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.UserRole>();
        var userRoles = await userRoleRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(userRoles);
    }
}
