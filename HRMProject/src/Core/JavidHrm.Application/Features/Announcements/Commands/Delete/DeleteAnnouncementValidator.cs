using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class DeleteAnnouncementValidator : AbstractValidator<DeleteAnnouncementRequest>
{
    public DeleteAnnouncementValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
