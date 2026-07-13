using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Notifications.Queries;

public record GetAllNotificationRequest : IRequest<OperationResult<PagedResult<GetAllNotificationResponse>>>, IContentPolicyFilteredRequest<Notification>
{
    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public bool? IsRead { get; init; }
    public NotificationType? Type { get; init; }
    public string? Title { get; init; }
    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
