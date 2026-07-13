using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.Permissions;
using JavidHrm.Application.Features.Permissions.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IPermissionMapperService : IMapper
{
    HasPermissionResponse Map(bool hasPermission);
    GetPermissionResponse Map(Permission model);
    PagedResult<GetAllPermissionResponse> Map(PagedResult<Permission> model);
    GetAllPermissionRequestDto Map(GetAllPermissionRequest model);
}