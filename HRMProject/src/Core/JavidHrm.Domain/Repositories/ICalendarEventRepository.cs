using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.CalendarEvents;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface ICalendarEventRepository
{
    void Add(CalendarEvent calendarEvent);
    void Remove(CalendarEvent calendarEvent);
    ValueTask<CalendarEvent?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<CalendarEvent?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<CalendarEvent, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllCalendarEventResponseDto>> GetAllAsync(
        GetAllCalendarEventRequestDto request,
        Expression<Func<CalendarEvent, bool>>? contentFilter = null);
}
