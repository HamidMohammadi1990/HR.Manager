using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.CalendarEvents;

public class GetAllCalendarEventResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime StartAtUtc { get; set; }
    public DateTime EndAtUtc { get; set; }
    public bool IsAllDay { get; set; }
    public CalendarEventType EventType { get; set; }
    public int? UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? Color { get; set; }
}
