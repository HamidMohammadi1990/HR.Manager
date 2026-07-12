using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Users.Commands;

public class SignOutUserValidator : AbstractValidator<SignOutUserRequest>
{
    public SignOutUserValidator()
    {
        RuleFor(x => x.Token)
            .NotEmpty()
            .NotNull()
            .Must(x => x.Length > 0)
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
