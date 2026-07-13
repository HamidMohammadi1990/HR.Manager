using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Roles;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Roles.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IRoleMapperService : IMapper
{
    GetRoleResponse Map(Role model);
    PagedResult<GetAllRoleResponse> Map(PagedResult<Role> model);
    GetAllRoleRequestDto Map(GetAllRoleRequest model);
}