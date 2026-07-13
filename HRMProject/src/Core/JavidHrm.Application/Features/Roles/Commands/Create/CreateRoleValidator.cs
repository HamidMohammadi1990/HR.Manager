using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Roles.Commands;

public class CreateRoleValidator : AbstractValidator<CreateRoleRequest>
{
    public CreateRoleValidator(IRoleRepository roleRepository)
    {
        RuleFor(x => x.Title)
          .NotNull()
          .WithMessage(MessageKeys.TitleRequired)
          .MustAsync(async (x, CancellationToken)
                 => !await roleRepository.AnyAsync(c => c.Title == x.Trim()))
          .WithMessage(MessageKeys.DuplicateTitle);
    }
}
