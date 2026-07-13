using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Permissions.Commands;

public class DeletePermissionValidator : AbstractValidator<DeletePermissionRequest>
{
    public DeletePermissionValidator()
    {
        RuleFor(x => x.Id)
            .IsInEnum()
            .WithMessage(MessageKeys.PermissionIdInvalid);
    }
}
