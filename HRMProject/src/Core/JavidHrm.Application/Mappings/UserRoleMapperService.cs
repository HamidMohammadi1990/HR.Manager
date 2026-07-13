using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserRoles;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.UserRoles.Queries;

namespace JavidHrm.Application.Mappings;

public class UserRoleMapperService : IUserRoleMapperService
{
    public GetAllUserRoleRequestDto Map(GetAllUserRoleRequest model)
    {
        return new GetAllUserRoleRequestDto
        {
            UserId = model.UserId,
            RoleId = model.RoleId,
            Pagination = model.Pagination
        };
    }

    public GetUserRoleResponse Map(GetUserRoleDto model)
    {
        return new GetUserRoleResponse
        {
            Id = model.Id,
            UserId = model.UserId,
            UserName = model.UserName,
            RoleId = model.RoleId,
            RoleTitle = model.RoleTitle
        };
    }

    public PagedResult<GetAllUserRoleResponse> Map(PagedResult<GetAllUserRoleDto> model)
    {
        var items = model.Items.Select(x => new GetAllUserRoleResponse
        {
            Id = x.Id,
            UserId = x.UserId,
            UserName = x.UserName,
            RoleId = x.RoleId,
            RoleTitle = x.RoleTitle
        }).ToList();

        return PagedResult<GetAllUserRoleResponse>.Create(items, model);
    }
}
