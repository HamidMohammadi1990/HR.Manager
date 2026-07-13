using JavidHrm.Common.Models;
using JavidHrm.Common.Security;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Users.Commands;

public class SignInUserHandler
    (
        IUserRepository userRepository,
        IAccountingService accountingService,
        IPasswordHasher passwordHasher,
        IUnitOfWork unitOfWork,
        ICurrentUserContext currentUser)
    : IRequestHandler<SignInUserRequest, OperationResult<SignInUserResponse>>
{
    public async Task<OperationResult<SignInUserResponse>> Handle(SignInUserRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByLoginAsync(request.UserName, cancellationToken);

        if (user is null || !passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
            return ErrorModel.Create("UserNameOrPasswordIsNotValid");

        if (passwordHasher.NeedsRehash(user.PasswordHash))
        {
            user.UpdatePassword(passwordHasher.HashPassword(request.Password));
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        var tokenResponse = await accountingService.IssueTokenPairAsync(
            user,
            currentUser.GetSessionContext(),
            cancellationToken: cancellationToken);

        if (!tokenResponse.IsSuccess)
            return OperationResult<SignInUserResponse>.Fail();

        return new SignInUserResponse
        {
            ExpiresIn = tokenResponse.Result!.ExpiresIn,
            TokenType = tokenResponse.Result.TokenType,
            AccessToken = tokenResponse.Result.AccessToken,
            RefreshToken = tokenResponse.Result.RefreshToken,
            SessionId = tokenResponse.Result.SessionId
        };
    }
}