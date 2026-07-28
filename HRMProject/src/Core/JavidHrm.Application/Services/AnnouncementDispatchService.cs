using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Services;

public class AnnouncementDispatchService(
    IAnnouncementRepository announcementRepository,
    INotificationRepository notificationRepository)
    : IAnnouncementDispatchService
{
    public async Task<OperationResult> DispatchInAppNotificationsAsync(
        Announcement announcement,
        CancellationToken cancellationToken = default)
    {
        if (!ShouldCreateInAppNotifications(announcement.Channel))
            return OperationResult.Success();

        var recipientUserIds = await announcementRepository.GetAudienceUserIdsAsync(
            announcement.Audience,
            announcement.DepartmentId,
            announcement.RoleId,
            cancellationToken);

        if (recipientUserIds.Count == 0)
            return OperationResult.Success();

        var message = BuildNotificationMessage(announcement.Content);
        var notifications = recipientUserIds
            .Select(userId => Notification.Create(
                userId,
                announcement.Title,
                message,
                NotificationType.Info,
                "/announcements",
                "material-symbols:campaign"))
            .ToList();

        notificationRepository.AddRange(notifications);
        return OperationResult.Success();
    }

    private static bool ShouldCreateInAppNotifications(AnnouncementChannel channel)
        => channel == AnnouncementChannel.InApp;

    private static string BuildNotificationMessage(string content)
    {
        var trimmed = content.Trim();
        if (trimmed.Length <= 200)
            return trimmed;

        return $"{trimmed[..197]}...";
    }
}
