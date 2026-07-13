using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Permissions.Queries;

public class HasPermissionValidator : AbstractValidator<HasPermissionRequest>
{
    public HasPermissionValidator()
    {
        RuleFor(x => x.UserId)
            .NotNull()
            .NotEqual(0)
            .WithMessage(MessageKeys.InvalidUser);

        RuleFor(x => x.PermissionType)
            .NotNull()
            .IsInEnum()
            .WithMessage(MessageKeys.InvalidPermission);
    }
}