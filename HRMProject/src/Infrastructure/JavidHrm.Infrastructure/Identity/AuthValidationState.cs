using JavidHrm.Application.Contracts;

namespace JavidHrm.Infrastructure.Identity;

public sealed class AuthValidationState : IAuthValidationState
{
    public bool? CachedResult { get; set; }
}
