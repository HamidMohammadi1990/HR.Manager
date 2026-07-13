using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.UserRoles.Queries;

public class GetUserRoleValidator : AbstractValidator<GetUserRoleRequest>
{
    public GetUserRoleValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
