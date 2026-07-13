using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public record GetCalendarEventRequest : IRequest<OperationResult<GetCalendarEventResponse?>>
{
    [JsonConverter(typeof(CalendarEventEncryptor))]
    public int Id { get; init; }
}
