using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Announcements.Queries;

public record GetAllAnnouncementResponse
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

    public string? DepartmentName { get; init; }

    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    public string? RoleName { get; init; }
    public DateTime? ScheduledAtUtc { get; init; }
    public DateTime? PublishedAtUtc { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int CreatedByUserId { get; init; }

    public string? CreatorFirstName { get; init; }
    public string? CreatorLastName { get; init; }
    public string? CreatorUserName { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
