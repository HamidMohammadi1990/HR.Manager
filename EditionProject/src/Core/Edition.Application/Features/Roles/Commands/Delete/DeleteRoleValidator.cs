using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Roles.Commands;

public class DeleteRoleValidator : AbstractValidator<DeleteRoleRequest>
{
    public DeleteRoleValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
