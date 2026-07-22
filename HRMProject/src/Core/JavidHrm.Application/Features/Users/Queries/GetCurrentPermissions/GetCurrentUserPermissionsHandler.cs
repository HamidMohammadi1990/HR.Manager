using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;

namespace JavidHrm.Application.Features.Users.Queries;

public class GetCurrentUserPermissionsHandler
    (ICurrentUserContext currentUser, IPermissionRepository permissionRepository)
    : IRequestHandler<GetCurrentUserPermissionsRequest, OperationResult<GetCurrentUserPermissionsResponse>>
{
    public async Task<OperationResult<GetCurrentUserPermissionsResponse>> Handle(
        GetCurrentUserPermissionsRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId;
        if (userId <= 0)
            return ErrorModel.Create("AccessDenied");

        var permissions = await permissionRepository.GetUserPermissionTypesAsync(userId, cancellationToken);

        return new GetCurrentUserPermissionsResponse
        {
            Permissions = permissions.Select(x => (int)x).ToList()
        };
    }
}
