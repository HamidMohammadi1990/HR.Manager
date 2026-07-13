using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Roles.Commands;

public class UpdateRoleValidator : AbstractValidator<UpdateRoleRequest>
{
    public UpdateRoleValidator(IRoleRepository roleRepository)
    {
        RuleFor(x => new { x.Id, x.Title })
          .NotNull()
          .WithMessage(MessageKeys.TitleRequired)
          .MustAsync(async (x, CancellationToken)
                 => !await roleRepository.AnyAsync(c => c.Id != x.Id && c.Title == x.Title.Trim()))
          .WithMessage(MessageKeys.DuplicateRole);
    }
}
