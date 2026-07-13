using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.UserRoles.Commands;

public class DeleteUserRoleValidator : AbstractValidator<DeleteUserRoleRequest>
{
    public DeleteUserRoleValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidIdValidator);
    }
}
