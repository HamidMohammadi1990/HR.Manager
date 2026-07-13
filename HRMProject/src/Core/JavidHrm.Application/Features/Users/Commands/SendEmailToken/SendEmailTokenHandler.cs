using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;

namespace JavidHrm.Application.Features.Users.Commands;

public class SendEmailTokenHandler
    (IUserRepository userRepository, IAccountingService accountingService)
    : IRequestHandler<SendEmailTokenRequest, OperationResult<SendEmailTokenResponse>>
{
    public async Task<OperationResult<SendEmailTokenResponse>> Handle(SendEmailTokenRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByUserNameAsync(request.UserName, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        if (string.IsNullOrEmpty(user.Email))
            return ErrorModel.Create("ThereIsNoEmailRegisteredForYou");

        var emailSendResult = await accountingService.SendActivationCodeToEmailAsync(user.Email);
        if (emailSendResult.AlreadySend && emailSendResult.SuccessSent)
            return new SendEmailTokenResponse
            {
                Message = emailSendResult.Message!,
                OptionType = ForgetPasswordOptionType.Message
            };

        return new SendEmailTokenResponse
        {
            Message = ErrorModel.Create("VerificationCodeHasBeenSent"),
            OptionType = ForgetPasswordOptionType.Message
        };
    }
}