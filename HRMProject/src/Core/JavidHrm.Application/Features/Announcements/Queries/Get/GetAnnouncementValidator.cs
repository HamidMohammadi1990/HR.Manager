using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Announcements.Queries;

public class GetAnnouncementValidator : AbstractValidator<GetAnnouncementRequest>
{
    public GetAnnouncementValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
