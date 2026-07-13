using FluentValidation;

namespace JavidHrm.Application.Features.Announcements.Queries;

public class GetAllAnnouncementValidator : AbstractValidator<GetAllAnnouncementRequest>
{
    public GetAllAnnouncementValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
