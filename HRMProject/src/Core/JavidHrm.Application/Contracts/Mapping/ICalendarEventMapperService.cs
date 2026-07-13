using JavidHrm.Application.Features.CalendarEvents.Queries;
using JavidHrm.Domain.Dtos.CalendarEvents;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ICalendarEventMapperService : IMapper
{
    GetAllCalendarEventRequestDto Map(GetAllCalendarEventRequest model);
    GetCalendarEventResponse Map(CalendarEvent model, User? user, Department? department);
    PagedResult<GetAllCalendarEventResponse> Map(PagedResult<GetAllCalendarEventResponseDto> model);
}
