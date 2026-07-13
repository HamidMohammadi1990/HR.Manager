using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public class UpdateCalendarEventHandler
    (ICalendarEventRepository calendarEventRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateCalendarEventRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateCalendarEventRequest request, CancellationToken cancellationToken)
    {
        var calendarEvent = await calendarEventRepository.FindAsync(request.Id, cancellationToken);
        if (calendarEvent is null)
            return ErrorModel.Create("InvalidId");

        calendarEvent.Update(
            request.Title.Trim(),
            request.Description?.Trim(),
            request.StartAtUtc,
            request.EndAtUtc,
            request.IsAllDay,
            request.EventType,
            request.UserId,
            request.DepartmentId,
            request.Color?.Trim());

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
