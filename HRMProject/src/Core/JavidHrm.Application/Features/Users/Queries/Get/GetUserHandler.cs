using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Users.Queries;

public class GetUserHandler
    (IUserRepository userRepository, IUserMapperService mapper, ICurrentUserContext currentUser, IAccountingService accountingService)
    : IRequestHandler<GetUserRequest, OperationResult<GetUserResponse?>>
{
    public async Task<OperationResult<GetUserResponse?>> Handle(GetUserRequest request, CancellationToken cancellationToken = default)
    {
        var currentUserId = currentUser.UserId;
        if (currentUserId <= 0)
            return ErrorModel.Create("AccessDenied");

        if (request.Id != currentUserId)
        {
            var canManageUsers = await accountingService.HasPermissionAsync(currentUserId, PermissionType.ManageUsers);
            if (!canManageUsers)
                return ErrorModel.Create("AccessDenied");
        }

        var user = await userRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        var result = mapper.Map(user);
        return result;
    }
}