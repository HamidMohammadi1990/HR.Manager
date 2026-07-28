using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Notifications;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface INotificationRepository
{
    void Add(Notification notification);
    void AddRange(IEnumerable<Notification> notifications);
    void Remove(Notification notification);
    void RemoveRange(IEnumerable<Notification> notifications);
    ValueTask<Notification?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Notification?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Notification, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllNotificationResponseDto>> GetAllAsync(
        GetAllNotificationRequestDto request,
        int? viewerUserId = null,
        Expression<Func<Notification, bool>>? contentFilter = null,
        CancellationToken cancellationToken = default);
    Task MarkBroadcastAsReadAsync(int notificationId, int userId, CancellationToken cancellationToken = default);
    Task MarkBroadcastAsUnreadAsync(int notificationId, int userId, CancellationToken cancellationToken = default);
    Task MarkAllVisibleAsReadAsync(int viewerUserId, CancellationToken cancellationToken = default);
    Task DeleteVisibleReadAsync(int viewerUserId, CancellationToken cancellationToken = default);
    Task<int> CountUnreadAsync(int viewerUserId, CancellationToken cancellationToken = default);
}
