using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Announcements.Commands;

public record CreateAnnouncementRequest : IRequest<OperationResult<CreateAnnouncementResponse>>
{
    public string Title { get; init; } = default!;
    public string Content { get; init; } = default!;
    public AnnouncementStatus Status { get; init; } = AnnouncementStatus.Draft;
    public AnnouncementAudience Audience { get; init; }
    public AnnouncementChannel Channel { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    public DateTime? ScheduledAtUtc { get; init; }
}
