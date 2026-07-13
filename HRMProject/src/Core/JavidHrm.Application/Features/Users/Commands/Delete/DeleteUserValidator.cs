using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Users.Commands;

public class DeleteUserValidator : AbstractValidator<DeleteUserRequest>
{
    public DeleteUserValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidId);
    }
}
