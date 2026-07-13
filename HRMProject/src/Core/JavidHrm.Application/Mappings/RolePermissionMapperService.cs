using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.RolePermissions;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.RolePermissions.Queries;

namespace JavidHrm.Application.Mappings;

public class RolePermissionMapperService : IRolePermissionMapperService
{
    public GetAllRolePermissionRequestDto Map(GetAllRolePermissionRequest model)
    {
        return new GetAllRolePermissionRequestDto
        {
            RoleId = model.RoleId,
            PermissionId = model.PermissionId,
            Pagination = model.Pagination
        };
    }

    public GetRolePermissionResponse Map(GetRolePermissionDto model)
    {
        return new GetRolePermissionResponse
        {
            Id = model.Id,
            RoleId = model.RoleId,
            RoleTitle = model.RoleTitle,
            PermissionId = model.PermissionId,
            PermissionTitle = model.PermissionTitle
        };
    }

    public PagedResult<GetAllRolePermissionResponse> Map(PagedResult<GetAllRolePermissionDto> model)
    {
        var items = model.Items.Select(x => new GetAllRolePermissionResponse
        {
            Id = x.Id,
            RoleId = x.RoleId,
            RoleTitle = x.RoleTitle,
            PermissionId = x.PermissionId,
            PermissionTitle = x.PermissionTitle
        }).ToList();

        return PagedResult<GetAllRolePermissionResponse>.Create(items, model);
    }
}
