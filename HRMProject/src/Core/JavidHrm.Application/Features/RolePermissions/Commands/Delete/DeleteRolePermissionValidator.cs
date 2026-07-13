using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public class DeleteRolePermissionValidator : AbstractValidator<DeleteRolePermissionRequest>
{
    public DeleteRolePermissionValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidIdValidator);
    }
}
