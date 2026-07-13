using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.CalendarEvents.Commands;

public record DeleteCalendarEventRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(CalendarEventEncryptor))]
    public int Id { get; init; }
}
