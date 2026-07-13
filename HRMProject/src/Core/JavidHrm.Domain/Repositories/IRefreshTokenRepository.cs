using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IRefreshTokenRepository
{
    void Add(RefreshToken refreshToken);
    Task<RefreshToken?> GetByToken(string token);
    Task InvalidateBySessionAsync(Guid sessionId);
}