using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.CalendarEvents;

public record GetAllCalendarEventRequestDto
{
    [QueryFilter(MemberPath = "calendarEvent.EventType")]
    public CalendarEventType? EventType { get; init; }

    [QueryFilter(MemberPath = "calendarEvent.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "calendarEvent.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "calendarEvent.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public DateTime? StartFromUtc { get; init; }
    public DateTime? EndToUtc { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
