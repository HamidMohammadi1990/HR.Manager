using JavidHrm.Application.Features.CalendarEvents.Queries;
using JavidHrm.Domain.Dtos.CalendarEvents;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class CalendarEventMapperService : ICalendarEventMapperService
{
    public GetAllCalendarEventRequestDto Map(GetAllCalendarEventRequest model)
        => new()
        {
            EventType = model.EventType,
            UserId = model.UserId,
            DepartmentId = model.DepartmentId,
            Title = model.Title,
            StartFromUtc = model.StartFromUtc,
            EndToUtc = model.EndToUtc,
            Pagination = model.Pagination
        };

    public GetCalendarEventResponse Map(CalendarEvent model, User? user, Department? department)
        => new()
        {
            Id = model.Id,
            Title = model.Title,
            Description = model.Description,
            StartAtUtc = model.StartAtUtc,
            EndAtUtc = model.EndAtUtc,
            IsAllDay = model.IsAllDay,
            EventType = model.EventType,
            UserId = model.UserId,
            UserFirstName = user?.FirstName,
            UserLastName = user?.LastName,
            UserName = user?.UserName,
            DepartmentId = model.DepartmentId,
            DepartmentName = department?.Name,
            Color = model.Color
        };

    public PagedResult<GetAllCalendarEventResponse> Map(PagedResult<GetAllCalendarEventResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllCalendarEventResponse
        {
            Id = x.Id,
            Title = x.Title,
            Description = x.Description,
            StartAtUtc = x.StartAtUtc,
            EndAtUtc = x.EndAtUtc,
            IsAllDay = x.IsAllDay,
            EventType = x.EventType,
            UserId = x.UserId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            Color = x.Color
        }).ToList();

        return PagedResult<GetAllCalendarEventResponse>.Create(items, model);
    }
}
