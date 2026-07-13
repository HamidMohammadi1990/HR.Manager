using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Users.Queries;

public class GetForgetPasswordOptionValidator : AbstractValidator<GetForgetPasswordOptionRequest>
{
    public GetForgetPasswordOptionValidator()
    {
        RuleFor(x => x.UserName)
            .NotNull()
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage(MessageKeys.UserNameIsNotValid);
    }
}
