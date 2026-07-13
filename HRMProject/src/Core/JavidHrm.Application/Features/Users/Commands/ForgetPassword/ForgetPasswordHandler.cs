using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;

namespace JavidHrm.Application.Features.Users.Commands;

public class ForgetPasswordHandler
    (IAccountingService accountingService, IUserRepository userRepository)
    : IRequestHandler<ForgetPasswordRequest, OperationResult<ForgetPasswordResponse>>
{
    public async Task<OperationResult<ForgetPasswordResponse>> Handle(ForgetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByUserNameAsync(request.UserName, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        if (!user.LoginPermission)
            return ErrorModel.Create("AccessDenied");

        if (!user.IsActive)
            return ErrorModel.Create("TheUserIsInActive");

        if (!user.PhoneNumberConfirmed && !user.EmailConfirmed)
            return ErrorModel.Create("MobileOrEmailIsNotVerified");

        var forgetPasswordOptions = accountingService.GetForgetPasswordOptionsByUser(user);
        if (forgetPasswordOptions.Count == 0)
            return ErrorModel.Create("NoAvailableMethodPasswordRecoveryDescription");

        if (forgetPasswordOptions.All(x => x.OptionType != request.OptionType))
            return ErrorModel.Create("PasswordResetIsNotAvailableWithTheSelectedMethod");

        if (request.OptionType == ForgetPasswordOptionType.Message)
        {
            var codeToPhoneResult = await accountingService.SendActivationCodeToPhoneAsync(user.PhoneNumber!);
            if (!codeToPhoneResult.SuccessSent)
                return codeToPhoneResult.Message;

            var messageOption = forgetPasswordOptions.First(x => x.OptionType is ForgetPasswordOptionType.Message);

            return new ForgetPasswordResponse
            {
                Message = $"کد فعالسازی به شماره موبایل {messageOption.Title} ارسال شد",
                UserName = request.UserName,
                OptionType = request.OptionType
            };
        }

        if (request.OptionType == ForgetPasswordOptionType.Email)
        {
            var codeToEmailResult = await accountingService.SendActivationCodeToEmailAsync(user.Email!);
            if (!codeToEmailResult.SuccessSent)
                return codeToEmailResult.Message;

            var messageOption = forgetPasswordOptions.First(x => x.OptionType is ForgetPasswordOptionType.Email);

            return new ForgetPasswordResponse
            {
                Message = $"کد فعالسازی به ایمیل {messageOption} ارسال شد",
                UserName = request.UserName,
                OptionType = request.OptionType
            };
        }

        return ErrorModel.Create("TheChosenMethodIsNotValid");
    }
}