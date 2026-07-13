using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Announcements;

public record GetAllAnnouncementRequestDto
{
    [QueryFilter(MemberPath = "announcement.Status")]
    public AnnouncementStatus? Status { get; init; }

    [QueryFilter(MemberPath = "announcement.Audience")]
    public AnnouncementAudience? Audience { get; init; }

    [QueryFilter(MemberPath = "announcement.Channel")]
    public AnnouncementChannel? Channel { get; init; }

    [QueryFilter(MemberPath = "announcement.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "announcement.RoleId")]
    public int? RoleId { get; init; }

    [QueryFilter(MemberPath = "announcement.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
