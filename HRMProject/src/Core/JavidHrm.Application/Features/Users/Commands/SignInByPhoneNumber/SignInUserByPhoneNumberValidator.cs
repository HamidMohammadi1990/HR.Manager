using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Extensions;

namespace JavidHrm.Application.Features.Users.Commands;

public class SignInUserByPhoneNumberValidator : AbstractValidator<SignInUserByPhoneNumberRequest>
{
    public SignInUserByPhoneNumberValidator()
    {
        RuleFor(x => x.Token)
            .NotNull()
            .NotEmpty()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.OtpRequired);

        RuleFor(x => x.UserName)
            .NotNull()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.UserNameIsNotValid)
            .Must(x => x.IsEmail() || x.IsMobile())
            .WithMessage(MessageKeys.EnterMobileOrEmailAsUserName);
    }
}
