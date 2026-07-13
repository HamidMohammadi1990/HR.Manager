using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.Announcements;

public class GetAllAnnouncementResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public AnnouncementStatus Status { get; set; }
    public AnnouncementAudience Audience { get; set; }
    public AnnouncementChannel Channel { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public int? RoleId { get; set; }
    public string? RoleName { get; set; }
    public DateTime? ScheduledAtUtc { get; set; }
    public DateTime? PublishedAtUtc { get; set; }
    public int CreatedByUserId { get; set; }
    public string? CreatorFirstName { get; set; }
    public string? CreatorLastName { get; set; }
    public string? CreatorUserName { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
