using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.UserRoles.Queries;

public class GetUserRoleHandler
    (IUserRoleRepository userRoleRepository, IUserRoleMapperService mapper)
    : IRequestHandler<GetUserRoleRequest, OperationResult<GetUserRoleResponse?>>
{
    public async Task<OperationResult<GetUserRoleResponse?>> Handle(GetUserRoleRequest request, CancellationToken cancellationToken)
    {
        var userRole = await userRoleRepository.GetInfoAsync(request.Id);
        if (userRole is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(userRole);
    }
}