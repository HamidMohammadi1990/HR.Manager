using JavidHrm.Domain.Common;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Entities;

public class Notification : BaseEntity
{
    public int UserId { get; private set; }
    public string Title { get; private set; } = default!;
    public string Message { get; private set; } = default!;
    public NotificationType Type { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime? ReadAtUtc { get; private set; }
    public string? LinkPath { get; private set; }
    public string? IconName { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;

    public User User { get; private set; } = default!;

    public static Notification Create(
        int userId,
        string title,
        string message,
        NotificationType type,
        string? linkPath,
        string? iconName)
        => new()
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            LinkPath = linkPath,
            IconName = iconName
        };

    public void Update(
        int userId,
        string title,
        string message,
        NotificationType type,
        string? linkPath,
        string? iconName)
    {
        UserId = userId;
        Title = title;
        Message = message;
        Type = type;
        LinkPath = linkPath;
        IconName = iconName;
    }

    public void MarkAsRead()
    {
        if (IsRead)
            return;

        IsRead = true;
        ReadAtUtc = DateTime.UtcNow;
    }

    public void MarkAsUnread()
    {
        IsRead = false;
        ReadAtUtc = null;
    }
}
