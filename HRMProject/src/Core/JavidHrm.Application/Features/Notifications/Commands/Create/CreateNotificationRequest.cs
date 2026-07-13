using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Notifications.Commands;

public record CreateNotificationRequest : IRequest<OperationResult<CreateNotificationResponse>>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string Title { get; init; } = default!;
    public string Message { get; init; } = default!;
    public NotificationType Type { get; init; } = NotificationType.Info;
    public string? LinkPath { get; init; }
    public string? IconName { get; init; }
}

public record CreateNotificationResponse
{
    [JsonConverter(typeof(NotificationEncryptor))]
    public int Id { get; init; }
}
