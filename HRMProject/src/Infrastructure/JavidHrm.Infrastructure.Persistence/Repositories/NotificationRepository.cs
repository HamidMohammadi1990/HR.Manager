using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Notifications;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class NotificationRepository(JavidHrmDbContext context)
    : Repository<Notification>(context), INotificationRepository
{
    public void AddRange(IEnumerable<Notification> notifications)
        => Context.Notification.AddRange(notifications);

    public void RemoveRange(IEnumerable<Notification> notifications)
        => Context.Notification.RemoveRange(notifications);

    public async Task<PagedResult<GetAllNotificationResponseDto>> GetAllAsync(
        GetAllNotificationRequestDto request,
        int? viewerUserId = null,
        Expression<Func<Notification, bool>>? contentFilter = null,
        CancellationToken cancellationToken = default)
    {
        var requestSource = Context.Notification.ApplyContentPolicyFilter(contentFilter);

        if (viewerUserId.HasValue)
            requestSource = await ApplyViewerVisibilityAsync(requestSource, viewerUserId.Value, cancellationToken);

        var notifications =
            from notification in requestSource
            join user in Context.User on notification.UserId equals user.Id into users
            from user in users.DefaultIfEmpty()
            select new { notification, user };

        notifications = notifications.ApplyQueryFilters(request);

        if (request.CreatedFromUtc.HasValue)
            notifications = notifications.Where(x => x.notification.CreatedOnUtc >= request.CreatedFromUtc.Value);

        if (request.CreatedToUtc.HasValue)
            notifications = notifications.Where(x => x.notification.CreatedOnUtc <= request.CreatedToUtc.Value);

        if (request.IsRead.HasValue && viewerUserId.HasValue)
        {
            var userId = viewerUserId.Value;
            notifications = request.IsRead.Value
                ? notifications.Where(x =>
                    (x.notification.UserId != null && x.notification.IsRead)
                    || (x.notification.UserId == null && Context.NotificationReadReceipt.Any(r =>
                        r.NotificationId == x.notification.Id && r.UserId == userId)))
                : notifications.Where(x =>
                    (x.notification.UserId != null && !x.notification.IsRead)
                    || (x.notification.UserId == null && !Context.NotificationReadReceipt.Any(r =>
                        r.NotificationId == x.notification.Id && r.UserId == userId)));
        }

        return await notifications
            .OrderByDescending(x => x.notification.CreatedOnUtc)
            .Select(x => new GetAllNotificationResponseDto
            {
                Id = x.notification.Id,
                UserId = x.notification.UserId,
                UserFirstName = x.user != null ? x.user.FirstName : null,
                UserLastName = x.user != null ? x.user.LastName : null,
                UserName = x.user != null ? x.user.UserName : null,
                Title = x.notification.Title,
                Message = x.notification.Message,
                Type = x.notification.Type,
                IsRead = x.notification.UserId != null
                    ? x.notification.IsRead
                    : Context.NotificationReadReceipt.Any(r =>
                        r.NotificationId == x.notification.Id && r.UserId == viewerUserId),
                ReadAtUtc = x.notification.UserId != null
                    ? x.notification.ReadAtUtc
                    : Context.NotificationReadReceipt
                        .Where(r => r.NotificationId == x.notification.Id && r.UserId == viewerUserId)
                        .Select(r => (DateTime?)r.ReadAtUtc)
                        .FirstOrDefault(),
                LinkPath = x.notification.LinkPath,
                IconName = x.notification.IconName,
                CreatedOnUtc = x.notification.CreatedOnUtc,
                IsBroadcast = x.notification.UserId == null
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public Task<int> CountUnreadAsync(int viewerUserId, CancellationToken cancellationToken = default)
    {
        return CountUnreadInternalAsync(viewerUserId, cancellationToken);
    }

    private async Task<int> CountUnreadInternalAsync(int viewerUserId, CancellationToken cancellationToken)
    {
        var visible = await ApplyViewerVisibilityAsync(Context.Notification.AsNoTracking(), viewerUserId, cancellationToken);
        return await visible
            .Where(notification =>
                (notification.UserId != null && !notification.IsRead)
                || (notification.UserId == null && !Context.NotificationReadReceipt.Any(r =>
                    r.NotificationId == notification.Id && r.UserId == viewerUserId)))
            .CountAsync(cancellationToken);
    }

    public async Task MarkBroadcastAsReadAsync(int notificationId, int userId, CancellationToken cancellationToken = default)
    {
        var exists = await Context.NotificationReadReceipt.AnyAsync(
            r => r.NotificationId == notificationId && r.UserId == userId,
            cancellationToken);
        if (exists)
            return;

        Context.NotificationReadReceipt.Add(NotificationReadReceipt.Create(notificationId, userId));
    }

    public async Task MarkBroadcastAsUnreadAsync(int notificationId, int userId, CancellationToken cancellationToken = default)
    {
        var receipt = await Context.NotificationReadReceipt.FirstOrDefaultAsync(
            r => r.NotificationId == notificationId && r.UserId == userId,
            cancellationToken);
        if (receipt is null)
            return;

        Context.NotificationReadReceipt.Remove(receipt);
    }

    public async Task MarkAllVisibleAsReadAsync(int viewerUserId, CancellationToken cancellationToken = default)
    {
        var visible = await ApplyViewerVisibilityAsync(Context.Notification, viewerUserId, cancellationToken);

        var personalUnread = await visible
            .Where(n => n.UserId == viewerUserId && !n.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var notification in personalUnread)
            notification.MarkAsRead();

        var broadcastUnreadIds = await visible
            .AsNoTracking()
            .Where(n => n.UserId == null)
            .Where(n => !Context.NotificationReadReceipt.Any(r =>
                r.NotificationId == n.Id && r.UserId == viewerUserId))
            .Select(n => n.Id)
            .ToListAsync(cancellationToken);

        foreach (var notificationId in broadcastUnreadIds)
            Context.NotificationReadReceipt.Add(NotificationReadReceipt.Create(notificationId, viewerUserId));
    }

    public async Task DeleteVisibleReadAsync(int viewerUserId, CancellationToken cancellationToken = default)
    {
        var visible = await ApplyViewerVisibilityAsync(Context.Notification, viewerUserId, cancellationToken);

        var personalRead = await visible
            .Where(n => n.UserId == viewerUserId && n.IsRead)
            .ToListAsync(cancellationToken);

        Context.Notification.RemoveRange(personalRead);

        var broadcastReceipts = await Context.NotificationReadReceipt
            .Where(r => r.UserId == viewerUserId)
            .Where(r => Context.Notification.Any(n => n.Id == r.NotificationId && n.UserId == null))
            .ToListAsync(cancellationToken);

        Context.NotificationReadReceipt.RemoveRange(broadcastReceipts);
    }

    private async Task<IQueryable<Notification>> ApplyViewerVisibilityAsync(
        IQueryable<Notification> source,
        int viewerUserId,
        CancellationToken cancellationToken)
    {
        var departmentId = await Context.Employee
            .AsNoTracking()
            .Where(employee => employee.UserId == viewerUserId && employee.IsActive)
            .Select(employee => (int?)employee.DepartmentId)
            .FirstOrDefaultAsync(cancellationToken);

        var roleIds = await Context.UserRole
            .AsNoTracking()
            .Where(userRole => userRole.UserId == viewerUserId)
            .Select(userRole => userRole.RoleId)
            .ToListAsync(cancellationToken);

        return ApplyViewerVisibilityQuery(source, viewerUserId, departmentId, roleIds);
    }

    private static IQueryable<Notification> ApplyViewerVisibilityQuery(
        IQueryable<Notification> source,
        int viewerUserId,
        int? departmentId = null,
        IReadOnlyCollection<int>? roleIds = null)
        => source.Where(notification =>
            notification.UserId == viewerUserId
            || (notification.UserId == null
                && notification.AudienceDepartmentId == null
                && notification.AudienceRoleId == null)
            || (notification.UserId == null
                && notification.AudienceDepartmentId != null
                && departmentId != null
                && notification.AudienceDepartmentId == departmentId)
            || (notification.UserId == null
                && notification.AudienceRoleId != null
                && roleIds != null
                && roleIds.Contains(notification.AudienceRoleId.Value)));
}
