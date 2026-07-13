using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Notifications.Queries;

public record GetNotificationRequest : IRequest<OperationResult<GetNotificationResponse?>>
{
    [JsonConverter(typeof(NotificationEncryptor))]
    public int Id { get; init; }
}
