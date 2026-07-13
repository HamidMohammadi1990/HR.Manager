using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public class GetRolePermissionValidator : AbstractValidator<GetRolePermissionRequest>
{
    public GetRolePermissionValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
