using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.RolePermissions;
using JavidHrm.Application.Features.RolePermissions.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IRolePermissionMapperService : IMapper
{
    GetAllRolePermissionRequestDto Map(GetAllRolePermissionRequest model);
    GetRolePermissionResponse Map(GetRolePermissionDto model);
    PagedResult<GetAllRolePermissionResponse> Map(PagedResult<GetAllRolePermissionDto> model);
}
