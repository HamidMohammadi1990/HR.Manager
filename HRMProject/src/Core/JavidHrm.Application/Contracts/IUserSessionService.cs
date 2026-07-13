using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Models.Services;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Common.Caching.Enums;
using JavidHrm.Application.Common.Caching.Abstractions;

namespace JavidHrm.Application.Contracts;

public interface IUserSessionService
{
    Task<UserSession> CreateSessionAsync(Guid sessionId, int userId, string jwtId, UserSessionContext context, DateTime expiresOnUtc, CancellationToken cancellationToken = default);
    Task<UserSession?> ContinueSessionAsync(Guid sessionId, int userId, string jwtId, CancellationToken cancellationToken = default);
    Task<bool> ValidateSessionAsync(Guid sessionId, int userId, string jwtId, CancellationToken cancellationToken = default);
    Task RevokeSessionAsync(Guid sessionId, int userId, UserSessionRevokeReason reason, CancellationToken cancellationToken = default);
    Task RevokeAllSessionsAsync(int userId, UserSessionRevokeReason reason, Guid? exceptSessionId = null, CancellationToken cancellationToken = default);
    Task EnforceSessionLimitAsync(int userId, CancellationToken cancellationToken = default);
    Task<List<UserSession>> GetActiveSessionsAsync(int userId, CancellationToken cancellationToken = default);
}
