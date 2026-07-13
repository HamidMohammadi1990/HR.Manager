using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public class DeleteCalendarEventHandler
    (ICalendarEventRepository calendarEventRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteCalendarEventRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteCalendarEventRequest request, CancellationToken cancellationToken)
    {
        var calendarEvent = await calendarEventRepository.FindAsync(request.Id, cancellationToken);
        if (calendarEvent is null)
            return ErrorModel.Create("InvalidId");

        calendarEventRepository.Remove(calendarEvent);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
