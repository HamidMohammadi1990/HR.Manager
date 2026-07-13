using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository
    (JavidHrmDbContext context)
    : Repository<RefreshToken, long>(context), IRefreshTokenRepository
{
    public async Task<RefreshToken?> GetByToken(string token)
    {
        return await Context.RefreshToken
            .SingleOrDefaultAsync(x => x.JwtId == token && !x.Invalidated && !x.Used);
    }

    public async Task InvalidateBySessionAsync(Guid sessionId)
    {
        var tokens = await Context.RefreshToken
            .Where(x => x.UserSessionId == sessionId && !x.Invalidated)
            .ToListAsync();

        foreach (var token in tokens)
            token.Invalidate();
    }
}