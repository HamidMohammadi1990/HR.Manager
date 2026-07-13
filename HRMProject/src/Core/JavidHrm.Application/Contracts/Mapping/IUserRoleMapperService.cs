using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserRoles;
using JavidHrm.Application.Features.UserRoles.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IUserRoleMapperService : IMapper
{
    GetAllUserRoleRequestDto Map(GetAllUserRoleRequest model);
    GetUserRoleResponse Map(GetUserRoleDto model);
    PagedResult<GetAllUserRoleResponse> Map(PagedResult<GetAllUserRoleDto> model);
}
