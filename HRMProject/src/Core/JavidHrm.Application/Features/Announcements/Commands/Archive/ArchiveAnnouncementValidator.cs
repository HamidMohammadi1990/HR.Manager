using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class ArchiveAnnouncementValidator : AbstractValidator<ArchiveAnnouncementRequest>
{
    public ArchiveAnnouncementValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
