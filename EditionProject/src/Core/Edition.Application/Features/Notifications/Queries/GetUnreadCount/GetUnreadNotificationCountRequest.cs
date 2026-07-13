using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Notifications.Queries;

public record GetUnreadNotificationCountRequest : IRequest<OperationResult<GetUnreadNotificationCountResponse>>
{
    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }
}

public record GetUnreadNotificationCountResponse
{
    public int UnreadCount { get; init; }
}
