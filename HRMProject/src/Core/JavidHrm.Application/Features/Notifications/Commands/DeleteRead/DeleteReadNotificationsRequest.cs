using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Notifications.Commands;

public record DeleteReadNotificationsRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }
}
