using FluentValidation;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.Notifications.Commands;

public class CreateNotificationValidator : AbstractValidator<CreateNotificationRequest>
{
    public CreateNotificationValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.UserId).GreaterThan(0);
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Message).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.LinkPath).MaximumLength(500);
        RuleFor(x => x.IconName).MaximumLength(100);
        RuleFor(x => x.Type).IsInEnum();

        RuleFor(x => x.UserId)
            .MustAsync(async (userId, cancellationToken) =>
                await userRepository.AnyAsync(u => u.Id == userId, cancellationToken))
            .WithErrorCode("InvalidId");
    }
}
