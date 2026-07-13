using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Permissions.Queries;

public class GetPermissionHandler
    (IPermissionRepository permissionRepository, IPermissionMapperService mapper)
    : IRequestHandler<GetPermissionRequest, OperationResult<GetPermissionResponse?>>
{
    public async Task<OperationResult<GetPermissionResponse?>> Handle(GetPermissionRequest request, CancellationToken cancellationToken)
    {
        var permission = await permissionRepository.GetAsNoTrackingAsync(request.Id);
        if (permission is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(permission);
        return result;
    }
}