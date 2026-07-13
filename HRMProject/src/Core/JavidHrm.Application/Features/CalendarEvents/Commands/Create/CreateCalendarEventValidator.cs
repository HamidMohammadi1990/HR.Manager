using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public class CreateCalendarEventValidator : AbstractValidator<CreateCalendarEventRequest>
{
    public CreateCalendarEventValidator(IUserRepository userRepository, IDepartmentRepository departmentRepository)
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Description).MaximumLength(2000);
        RuleFor(x => x.StartAtUtc).NotEmpty();
        RuleFor(x => x.EndAtUtc).NotEmpty();
        RuleFor(x => x).Must(r => r.EndAtUtc >= r.StartAtUtc).WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
        RuleFor(x => x.EventType).IsInEnum().Must(e => e != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.Color).MaximumLength(20);

        When(x => x.UserId.HasValue, () =>
        {
            RuleFor(x => x.UserId!.Value).MustBeValidEntityId();
            RuleFor(x => x.UserId!.Value)
                .MustAsync(async (id, ct) => await userRepository.AnyAsync(u => u.Id == id, ct))
                .WithMessage(MessageKeys.InvalidId);
        });

        When(x => x.DepartmentId.HasValue, () =>
        {
            RuleFor(x => x.DepartmentId!.Value).MustBeValidEntityId();
            RuleFor(x => x.DepartmentId!.Value)
                .MustAsync(async (id, ct) => await departmentRepository.AnyAsync(d => d.Id == id, ct))
                .WithMessage(MessageKeys.InvalidId);
        });
    }
}
