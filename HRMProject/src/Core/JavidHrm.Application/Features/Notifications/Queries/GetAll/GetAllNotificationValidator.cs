using FluentValidation;

namespace JavidHrm.Application.Features.Notifications.Queries;

public class GetAllNotificationValidator : AbstractValidator<GetAllNotificationRequest>
{
    public GetAllNotificationValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
