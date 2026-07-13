using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class CreateAnnouncementValidator : AbstractValidator<CreateAnnouncementRequest>
{
    public CreateAnnouncementValidator(
        IDepartmentRepository departmentRepository,
        IRoleRepository roleRepository)
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Content).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.Status).IsInEnum().Must(s => s != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.Audience).IsInEnum().Must(a => a != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.Channel).IsInEnum().Must(c => c != default).WithMessage(MessageKeys.InvalidId);

        When(x => x.DepartmentId.HasValue, () =>
        {
            RuleFor(x => x.DepartmentId!.Value).MustBeValidEntityId();
            RuleFor(x => x.DepartmentId!.Value)
                .MustAsync(async (id, ct) => await departmentRepository.AnyAsync(d => d.Id == id, ct))
                .WithMessage(MessageKeys.InvalidId);
        });

        When(x => x.RoleId.HasValue, () =>
        {
            RuleFor(x => x.RoleId!.Value).MustBeValidEntityId();
            RuleFor(x => x.RoleId!.Value)
                .MustAsync(async (id, ct) => await roleRepository.AnyAsync(r => r.Id == id, ct))
                .WithMessage(MessageKeys.InvalidId);
        });
    }
}
