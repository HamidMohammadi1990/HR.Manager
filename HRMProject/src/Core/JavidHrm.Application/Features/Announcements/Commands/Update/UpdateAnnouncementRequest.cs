using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Announcements.Commands;

public record UpdateAnnouncementRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(AnnouncementEncryptor))]
    public int Id { get; init; }

    public string Title { get; init; } = default!;
    public string Content { get; init; } = default!;
    public AnnouncementStatus Status { get; init; }
    public AnnouncementAudience Audience { get; init; }
    public AnnouncementChannel Channel { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    public DateTime? ScheduledAtUtc { get; init; }
}
