using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Announcements;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IAnnouncementRepository
{
    void Add(Announcement announcement);
    void Remove(Announcement announcement);
    ValueTask<Announcement?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Announcement?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Announcement, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllAnnouncementResponseDto>> GetAllAsync(
        GetAllAnnouncementRequestDto request,
        Expression<Func<Announcement, bool>>? contentFilter = null);
}
