using JavidHrm.Application.Models.Services;

namespace JavidHrm.Application.Contracts;

public interface ICurrentUserContext
{
    int UserId { get; }

    Guid? SessionId { get; }

    bool IsAuthenticated { get; }

    bool IsCooperation { get; }

    string? ClientIp { get; }

    UserSessionContext GetSessionContext();
}
