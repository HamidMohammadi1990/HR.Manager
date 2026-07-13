using JavidHrm.Common.Models;
using JavidHrm.Common.Extensions;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Users.Queries;

public class UserNameCheckHandler
    (IUserRepository userRepository, IUserMapperService mapper)
    : IRequestHandler<UserNameCheckRequest, OperationResult<UserNameCheckResponse>>
{
    public async Task<OperationResult<UserNameCheckResponse>> Handle(UserNameCheckRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByUserNameAsync(request.UserName, cancellationToken);
        if (user is null)
            return mapper.Map(false, request.UserName.IsMobile());

        if (!user.PhoneNumberConfirmed && !user.EmailConfirmed)
            return ErrorModel.Create("EmailOrMobileIsNotVerified");

        if (!user.LoginPermission)
            return ErrorModel.Create("AccessDenied");

        if (!user.IsActive)
            return ErrorModel.Create("UserIsInActive");

        return mapper.Map(true, request.UserName.IsMobile());
    }
}