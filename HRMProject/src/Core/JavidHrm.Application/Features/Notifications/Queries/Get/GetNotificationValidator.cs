using FluentValidation;

namespace JavidHrm.Application.Features.Notifications.Queries;

public class GetNotificationValidator : AbstractValidator<GetNotificationRequest>
{
    public GetNotificationValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
    }
}
