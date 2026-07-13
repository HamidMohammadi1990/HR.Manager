using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public record CreateCalendarEventResponse
{
    [JsonConverter(typeof(CalendarEventEncryptor))]
    public int Id { get; init; }
}
