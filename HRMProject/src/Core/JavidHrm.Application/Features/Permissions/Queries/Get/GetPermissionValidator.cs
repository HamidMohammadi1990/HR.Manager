using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.Permissions.Queries;

public class GetPermissionValidator : AbstractValidator<GetPermissionRequest>
{
    public GetPermissionValidator()
    {
        RuleFor(x => x.Id)
            .IsInEnum()
            .WithMessage(MessageKeys.PermissionIdInvalid);
    }
}
