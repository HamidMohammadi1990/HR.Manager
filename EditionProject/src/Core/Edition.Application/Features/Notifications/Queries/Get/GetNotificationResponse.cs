using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Notifications.Queries;

public record GetNotificationResponse
{
    [JsonConverter(typeof(NotificationEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }
    public string Title { get; init; } = default!;
    public string Message { get; init; } = default!;
    public NotificationType Type { get; init; }
    public bool IsRead { get; init; }
    public DateTime? ReadAtUtc { get; init; }
    public string? LinkPath { get; init; }
    public string? IconName { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
