using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class Announcement : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string Content { get; private set; } = default!;
    public AnnouncementStatus Status { get; private set; }
    public AnnouncementAudience Audience { get; private set; }
    public AnnouncementChannel Channel { get; private set; }
    public int? DepartmentId { get; private set; }
    public int? RoleId { get; private set; }
    public DateTime? ScheduledAtUtc { get; private set; }
    public DateTime? PublishedAtUtc { get; private set; }
    public int CreatedByUserId { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public Department? Department { get; private set; }
    public Role? Role { get; private set; }
    public User CreatedByUser { get; private set; } = default!;

    public static Announcement Create(
        string title,
        string content,
        AnnouncementStatus status,
        AnnouncementAudience audience,
        AnnouncementChannel channel,
        int? departmentId,
        int? roleId,
        DateTime? scheduledAtUtc,
        int createdByUserId)
        => new()
        {
            Title = title,
            Content = content,
            Status = status,
            Audience = audience,
            Channel = channel,
            DepartmentId = departmentId,
            RoleId = roleId,
            ScheduledAtUtc = scheduledAtUtc,
            CreatedByUserId = createdByUserId
        };

    public void Update(
        string title,
        string content,
        AnnouncementStatus status,
        AnnouncementAudience audience,
        AnnouncementChannel channel,
        int? departmentId,
        int? roleId,
        DateTime? scheduledAtUtc)
    {
        Title = title;
        Content = content;
        Status = status;
        Audience = audience;
        Channel = channel;
        DepartmentId = departmentId;
        RoleId = roleId;
        ScheduledAtUtc = scheduledAtUtc;
    }

    public void Publish()
    {
        Status = AnnouncementStatus.Sent;
        PublishedAtUtc = DateTime.UtcNow;
    }

    public void Archive() => Status = AnnouncementStatus.Archived;
}
