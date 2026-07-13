using FluentValidation;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public class GetAllCalendarEventValidator : AbstractValidator<GetAllCalendarEventRequest>
{
    public GetAllCalendarEventValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
