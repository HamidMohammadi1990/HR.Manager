using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Users.Queries;

public class GetCurrentUserHandler
    (IUserRepository userRepository, IUserMapperService mapper, ICurrentUserContext currentUser)
    : IRequestHandler<GetCurrentUserRequest, OperationResult<GetUserResponse?>>
{
    public async Task<OperationResult<GetUserResponse?>> Handle(
        GetCurrentUserRequest request,
        CancellationToken cancellationToken = default)
    {
        var currentUserId = currentUser.UserId;
        if (currentUserId <= 0)
            return ErrorModel.Create("AccessDenied");

        var user = await userRepository.GetAsNoTrackingAsync(currentUserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        return mapper.Map(user);
    }
}
