using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public class DeleteCalendarEventValidator : AbstractValidator<DeleteCalendarEventRequest>
{
    public DeleteCalendarEventValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
