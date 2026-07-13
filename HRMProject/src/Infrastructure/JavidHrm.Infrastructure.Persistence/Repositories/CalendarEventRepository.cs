using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.CalendarEvents;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class CalendarEventRepository(JavidHrmDbContext context)
    : Repository<CalendarEvent>(context), ICalendarEventRepository
{
    public async Task<PagedResult<GetAllCalendarEventResponseDto>> GetAllAsync(
        GetAllCalendarEventRequestDto request,
        Expression<Func<CalendarEvent, bool>>? contentFilter = null)
    {
        var requestSource = Context.CalendarEvent.ApplyContentPolicyFilter(contentFilter);

        var calendarEvents =
            from calendarEvent in requestSource
            join user in Context.User on calendarEvent.UserId equals user.Id into users
            from user in users.DefaultIfEmpty()
            join department in Context.Department on calendarEvent.DepartmentId equals department.Id into departments
            from department in departments.DefaultIfEmpty()
            select new { calendarEvent, user, department };

        calendarEvents = calendarEvents.ApplyQueryFilters(request);

        if (request.StartFromUtc.HasValue)
            calendarEvents = calendarEvents.Where(x => x.calendarEvent.EndAtUtc >= request.StartFromUtc.Value);

        if (request.EndToUtc.HasValue)
            calendarEvents = calendarEvents.Where(x => x.calendarEvent.StartAtUtc <= request.EndToUtc.Value);

        return await calendarEvents
            .OrderBy(x => x.calendarEvent.StartAtUtc)
            .Select(x => new GetAllCalendarEventResponseDto
            {
                Id = x.calendarEvent.Id,
                Title = x.calendarEvent.Title,
                Description = x.calendarEvent.Description,
                StartAtUtc = x.calendarEvent.StartAtUtc,
                EndAtUtc = x.calendarEvent.EndAtUtc,
                IsAllDay = x.calendarEvent.IsAllDay,
                EventType = x.calendarEvent.EventType,
                UserId = x.calendarEvent.UserId,
                UserFirstName = x.user != null ? x.user.FirstName : null,
                UserLastName = x.user != null ? x.user.LastName : null,
                UserName = x.user != null ? x.user.UserName : null,
                DepartmentId = x.calendarEvent.DepartmentId,
                DepartmentName = x.department != null ? x.department.Name : null,
                Color = x.calendarEvent.Color
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
