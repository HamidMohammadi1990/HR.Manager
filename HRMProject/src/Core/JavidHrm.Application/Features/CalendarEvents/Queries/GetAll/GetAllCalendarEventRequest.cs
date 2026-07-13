using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public record GetAllCalendarEventRequest : IRequest<OperationResult<PagedResult<GetAllCalendarEventResponse>>>, IContentPolicyFilteredRequest<CalendarEvent>
{
    public CalendarEventType? EventType { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    public string? Title { get; init; }
    public DateTime? StartFromUtc { get; init; }
    public DateTime? EndToUtc { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
