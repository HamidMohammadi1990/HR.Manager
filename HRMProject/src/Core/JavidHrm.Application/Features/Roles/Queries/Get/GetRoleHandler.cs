using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Roles.Queries;

public class GetRoleHandler
    (IRoleRepository roleRepository, IRoleMapperService mapper)
    : IRequestHandler<GetRoleRequest, OperationResult<GetRoleResponse?>>
{
    public async Task<OperationResult<GetRoleResponse?>> Handle(GetRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await roleRepository.GetAsNoTrackingAsync(request.Id);
        if (role is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(role);
        return result;
    }
}