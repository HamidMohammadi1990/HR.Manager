using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.RefreshTokens.Commands;

public record GenerateRefreshTokenRequest : IRequest<OperationResult<GenerateRefreshTokenResponse>>
{
    public string Token { get; init; } = default!;
    public string RefreshToken { get; init; } = default!;
}