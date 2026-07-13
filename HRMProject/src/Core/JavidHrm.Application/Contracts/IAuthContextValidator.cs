using System.Security.Claims;

namespace JavidHrm.Application.Contracts;

public interface IAuthContextValidator
{
    Task<bool> ValidateAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default);
}