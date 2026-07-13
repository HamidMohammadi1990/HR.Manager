using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Notifications;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface INotificationRepository
{
    void Add(Notification notification);
    void Remove(Notification notification);
    void RemoveRange(IEnumerable<Notification> notifications);
    ValueTask<Notification?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Notification?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Notification, bool>> expression, CancellationToken cancellationToken = default);
    Task<int> CountUnreadAsync(int? userId = null, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllNotificationResponseDto>> GetAllAsync(
        GetAllNotificationRequestDto request,
        Expression<Func<Notification, bool>>? contentFilter = null);
    Task MarkAllAsReadAsync(int? userId = null, CancellationToken cancellationToken = default);
    Task DeleteReadAsync(int? userId = null, CancellationToken cancellationToken = default);
}
