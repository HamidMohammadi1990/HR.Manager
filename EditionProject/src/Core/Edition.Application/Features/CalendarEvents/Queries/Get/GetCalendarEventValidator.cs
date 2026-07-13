using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public class GetCalendarEventValidator : AbstractValidator<GetCalendarEventRequest>
{
    public GetCalendarEventValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
