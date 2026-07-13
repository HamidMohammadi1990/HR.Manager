using FluentValidation;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class MarkNotificationReadValidator : AbstractValidator<MarkNotificationReadRequest>
{
    public MarkNotificationReadValidator(INotificationRepository notificationRepository)
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.Id)
            .MustAsync(async (id, cancellationToken) =>
                await notificationRepository.AnyAsync(n => n.Id == id, cancellationToken))
            .WithErrorCode("InvalidId");
    }
}
