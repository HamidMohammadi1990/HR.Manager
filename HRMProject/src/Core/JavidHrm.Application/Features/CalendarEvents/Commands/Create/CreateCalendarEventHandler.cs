using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public class CreateCalendarEventHandler
    (IUnitOfWork uow, ICalendarEventRepository calendarEventRepository)
    : IRequestHandler<CreateCalendarEventRequest, OperationResult<CreateCalendarEventResponse>>
{
    public async Task<OperationResult<CreateCalendarEventResponse>> Handle(CreateCalendarEventRequest request, CancellationToken cancellationToken)
    {
        var calendarEvent = Domain.Entities.CalendarEvent.Create(
            request.Title.Trim(),
            request.Description?.Trim(),
            request.StartAtUtc,
            request.EndAtUtc,
            request.IsAllDay,
            request.EventType,
            request.UserId,
            request.DepartmentId,
            request.Color?.Trim());

        calendarEventRepository.Add(calendarEvent);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateCalendarEventResponse>();

        return new CreateCalendarEventResponse { Id = calendarEvent.Id };
    }
}
