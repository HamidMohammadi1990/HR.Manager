using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public class GetAllRolePermissionValidator : AbstractValidator<GetAllRolePermissionRequest>
{
    public GetAllRolePermissionValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.RoleId).MustBeValidOptionalEntityId();
        RuleFor(x => x.PermissionId)
            .IsInEnum()
            .When(x => x.PermissionId.HasValue)
            .WithMessage(MessageKeys.PermissionIdInvalid);
    }
}
