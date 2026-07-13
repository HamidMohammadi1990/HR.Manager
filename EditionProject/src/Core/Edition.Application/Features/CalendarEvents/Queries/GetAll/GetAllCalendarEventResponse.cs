using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public record GetAllCalendarEventResponse
{
    [JsonConverter(typeof(CalendarEventEncryptor))]
    public int Id { get; init; }

    public string Title { get; init; } = default!;
    public string? Description { get; init; }
    public DateTime StartAtUtc { get; init; }
    public DateTime EndAtUtc { get; init; }
    public bool IsAllDay { get; init; }
    public CalendarEventType EventType { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    public string? DepartmentName { get; init; }
    public string? Color { get; init; }
}
