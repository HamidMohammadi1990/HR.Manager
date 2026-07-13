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
    public async Task<PagedResult<GetAllNotificationResponseDto>> GetAllAsync(
        GetAllNotificationRequestDto request,
        Expression<Func<Notification, bool>>? contentFilter = null)
    {
        var requestSource = Context.Notification.ApplyContentPolicyFilter(contentFilter);

        var notifications =
            from notification in requestSource
            join user in Context.User on notification.UserId equals user.Id
            select new { notification, user };

        notifications = notifications.ApplyQueryFilters(request);

        if (request.CreatedFromUtc.HasValue)
            notifications = notifications.Where(x => x.notification.CreatedOnUtc >= request.CreatedFromUtc.Value);

        if (request.CreatedToUtc.HasValue)
            notifications = notifications.Where(x => x.notification.CreatedOnUtc <= request.CreatedToUtc.Value);

        return await notifications
            .OrderByDescending(x => x.notification.CreatedOnUtc)
            .Select(x => new GetAllNotificationResponseDto
            {
                Id = x.notification.Id,
                UserId = x.notification.UserId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                Title = x.notification.Title,
                Message = x.notification.Message,
                Type = x.notification.Type,
                IsRead = x.notification.IsRead,
                ReadAtUtc = x.notification.ReadAtUtc,
                LinkPath = x.notification.LinkPath,
                IconName = x.notification.IconName,
                CreatedOnUtc = x.notification.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public Task<int> CountUnreadAsync(int? userId = null, CancellationToken cancellationToken = default)
    {
        var query = Context.Notification.AsNoTracking().Where(n => !n.IsRead);

        if (userId.HasValue)
            query = query.Where(n => n.UserId == userId.Value);

        return query.CountAsync(cancellationToken);
    }

    public async Task MarkAllAsReadAsync(int? userId = null, CancellationToken cancellationToken = default)
    {
        var query = Context.Notification.Where(n => !n.IsRead);

        if (userId.HasValue)
            query = query.Where(n => n.UserId == userId.Value);

        var now = DateTime.UtcNow;
        await query.ExecuteUpdateAsync(
            setters => setters
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAtUtc, now),
            cancellationToken);
    }

    public async Task DeleteReadAsync(int? userId = null, CancellationToken cancellationToken = default)
    {
        var query = Context.Notification.Where(n => n.IsRead);

        if (userId.HasValue)
            query = query.Where(n => n.UserId == userId.Value);

        await query.ExecuteDeleteAsync(cancellationToken);
    }
}
