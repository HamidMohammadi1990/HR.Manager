using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Notifications;

public record GetAllNotificationRequestDto
{
    [QueryFilter(MemberPath = "notification.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "notification.IsRead")]
    public bool? IsRead { get; init; }

    [QueryFilter(MemberPath = "notification.Type")]
    public NotificationType? Type { get; init; }

    [QueryFilter(MemberPath = "notification.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
