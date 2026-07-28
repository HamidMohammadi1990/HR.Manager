using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class NotificationReadReceipt : BaseEntity
{
    public int NotificationId { get; private set; }
    public int UserId { get; private set; }
    public DateTime ReadAtUtc { get; private set; } = DateTime.UtcNow;

    public Notification Notification { get; private set; } = default!;
    public User User { get; private set; } = default!;

    public static NotificationReadReceipt Create(int notificationId, int userId)
        => new()
        {
            NotificationId = notificationId,
            UserId = userId,
            ReadAtUtc = DateTime.UtcNow
        };
}
