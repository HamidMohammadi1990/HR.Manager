using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class PublishAnnouncementValidator : AbstractValidator<PublishAnnouncementRequest>
{
    public PublishAnnouncementValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
