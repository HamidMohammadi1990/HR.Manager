using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class UserSessionRepository
    (JavidHrmDbContext context)
    : Repository<UserSession, Guid>(context), IUserSessionRepository
{
    public async Task<UserSession?> GetActiveAsync(Guid id, int userId)
    {
        return await Context.UserSession
            .FirstOrDefaultAsync(x =>
                x.Id == id
                && x.UserId == userId
                && !x.IsRevoked
                && x.ExpiresOnUtc > DateTime.UtcNow);
    }

    public async Task<List<UserSession>> GetActiveSessionsAsync(int userId)
    {
        return await Context.UserSession
            .AsNoTracking()
            .Where(x =>
                x.UserId == userId
                && !x.IsRevoked
                && x.ExpiresOnUtc > DateTime.UtcNow)
            .OrderByDescending(x => x.LastSeenOnUtc)
            .ToListAsync();
    }

    public async Task<int> CountActiveSessionsAsync(int userId)
    {
        return await Context.UserSession
            .CountAsync(x =>
                x.UserId == userId
                && !x.IsRevoked
                && x.ExpiresOnUtc > DateTime.UtcNow);
    }

    public async Task<List<UserSession>> GetOldestActiveSessionsAsync(int userId, int take)
    {
        return await Context.UserSession
            .Where(x =>
                x.UserId == userId
                && !x.IsRevoked
                && x.ExpiresOnUtc > DateTime.UtcNow)
            .OrderBy(x => x.LastSeenOnUtc)
            .Take(take)
            .ToListAsync();
    }

    public async Task RevokeAllAsync(int userId, UserSessionRevokeReason reason, Guid? exceptSessionId = null)
    {
        var sessions = await Context.UserSession
            .Where(x =>
                x.UserId == userId
                && !x.IsRevoked
                && x.ExpiresOnUtc > DateTime.UtcNow
                && (exceptSessionId == null || x.Id != exceptSessionId))
            .ToListAsync();

        foreach (var session in sessions)
            session.Revoke(reason);
    }
}