using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Roles;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.Roles.Queries;

namespace JavidHrm.Application.Mappings;

public class RoleMapperService : IRoleMapperService
{
    public GetAllRoleRequestDto Map(GetAllRoleRequest model)
    {
        return new GetAllRoleRequestDto
        {
            Title = model.Title,
            IsActive = model.IsActive,
            Pagination = model.Pagination
        };
    }

    public GetRoleResponse Map(Role model)
    {
        return new GetRoleResponse
        {
            Id = model.Id,
            Title = model.Title,
            IsActive = model.IsActive
        };
    }

    public PagedResult<GetAllRoleResponse> Map(PagedResult<Role> model)
    {
        var items = model
            .Items
            .Select(x => new GetAllRoleResponse
            {
                Id = x.Id,
                Title = x.Title,
                IsActive = x.IsActive
            })
            .ToList();

        return PagedResult<GetAllRoleResponse>.Create(items, model);
    }
}