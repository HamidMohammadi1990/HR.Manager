using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public class GetCalendarEventHandler
    (ICalendarEventRepository calendarEventRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, ICalendarEventMapperService mapper)
    : IRequestHandler<GetCalendarEventRequest, OperationResult<GetCalendarEventResponse?>>
{
    public async Task<OperationResult<GetCalendarEventResponse?>> Handle(GetCalendarEventRequest request, CancellationToken cancellationToken)
    {
        var calendarEvent = await calendarEventRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (calendarEvent is null)
            return (GetCalendarEventResponse?)null;

        Domain.Entities.User? user = null;
        if (calendarEvent.UserId.HasValue)
        {
            user = await userRepository.GetAsNoTrackingAsync(calendarEvent.UserId.Value, cancellationToken);
            if (user is null)
                return ErrorModel.Create("InvalidId");
        }

        Domain.Entities.Department? department = null;
        if (calendarEvent.DepartmentId.HasValue)
        {
            department = await departmentRepository.GetAsNoTrackingAsync(calendarEvent.DepartmentId.Value, cancellationToken);
            if (department is null)
                return ErrorModel.Create("InvalidId");
        }

        return mapper.Map(calendarEvent, user, department);
    }
}
