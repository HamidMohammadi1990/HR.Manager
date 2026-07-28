using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Services;

public class AnnouncementDispatchService(
    INotificationRepository notificationRepository)
    : IAnnouncementDispatchService
{
    public async Task<OperationResult> DispatchInAppNotificationsAsync(
        Announcement announcement,
        CancellationToken cancellationToken = default)
    {
        if (!ShouldCreateInAppNotifications(announcement.Channel))
            return OperationResult.Success();

        if (await notificationRepository.AnyAsync(
                n => n.AnnouncementId == announcement.Id,
                cancellationToken))
            return OperationResult.Success();

        var message = BuildNotificationMessage(announcement.Content);
        var audienceDepartmentId = announcement.Audience == AnnouncementAudience.Department
            ? announcement.DepartmentId
            : null;
        var audienceRoleId = announcement.Audience == AnnouncementAudience.Role
            ? announcement.RoleId
            : null;

        notificationRepository.Add(Notification.CreateBroadcast(
            announcement.Id,
            audienceDepartmentId,
            audienceRoleId,
            announcement.Title,
            message,
            NotificationType.Info,
            "/announcements",
            "material-symbols:campaign"));

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
