using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Users.Commands;

public class ChangePasswordByOldPasswordValidator : AbstractValidator<ChangePasswordByOldPasswordRequest>
{
    public ChangePasswordByOldPasswordValidator()
    {
        RuleFor(x => x.OldPassword)
            .NotNull()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.PasswordIsNotValid);

        RuleFor(x => x.NewPassword)
            .NotNull()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.PasswordIsNotValid);
    }
}
