using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class CalendarEvent : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public DateTime StartAtUtc { get; private set; }
    public DateTime EndAtUtc { get; private set; }
    public bool IsAllDay { get; private set; }
    public CalendarEventType EventType { get; private set; }
    public int? UserId { get; private set; }
    public int? DepartmentId { get; private set; }
    public string? Color { get; private set; }

    public User? User { get; private set; }
    public Department? Department { get; private set; }

    public static CalendarEvent Create(
        string title,
        string? description,
        DateTime startAtUtc,
        DateTime endAtUtc,
        bool isAllDay,
        CalendarEventType eventType,
        int? userId,
        int? departmentId,
        string? color)
        => new()
        {
            Title = title,
            Description = description,
            StartAtUtc = startAtUtc,
            EndAtUtc = endAtUtc,
            IsAllDay = isAllDay,
            EventType = eventType,
            UserId = userId,
            DepartmentId = departmentId,
            Color = color
        };

    public void Update(
        string title,
        string? description,
        DateTime startAtUtc,
        DateTime endAtUtc,
        bool isAllDay,
        CalendarEventType eventType,
        int? userId,
        int? departmentId,
        string? color)
    {
        Title = title;
        Description = description;
        StartAtUtc = startAtUtc;
        EndAtUtc = endAtUtc;
        IsAllDay = isAllDay;
        EventType = eventType;
        UserId = userId;
        DepartmentId = departmentId;
        Color = color;
    }
}
