using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Extensions;

namespace JavidHrm.Application.Features.Users.Commands;

public class ChangeEmailValidator : AbstractValidator<ChangeEmailRequest>
{
    public ChangeEmailValidator()
    {
        RuleFor(x => x.Token)
            .NotNull()
            .NotEmpty()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.OtpRequired);

        RuleFor(x => x.Email)
            .NotNull()
            .WithMessage(MessageKeys.EmailRequired)
            .Must(x => x.IsEmail())
            .WithMessage(MessageKeys.EmailIsNotValid);
    }
}
