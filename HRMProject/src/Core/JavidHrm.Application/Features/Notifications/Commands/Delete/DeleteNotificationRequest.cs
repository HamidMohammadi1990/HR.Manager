using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Notifications.Commands;

public record DeleteNotificationRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(NotificationEncryptor))]
    public int Id { get; init; }
}
