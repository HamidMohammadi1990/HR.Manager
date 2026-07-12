using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.RefreshTokens.Commands;

public class GenerateRefreshTokenValidator : AbstractValidator<GenerateRefreshTokenRequest>
{
    public GenerateRefreshTokenValidator()
    {
        RuleFor(x => x.Token)
            .NotNull()
            .MinimumLength(1)
            .WithMessage(MessageKeys.InvalidToken);

        RuleFor(x => x.RefreshToken)
            .NotNull()
            .MinimumLength(1)
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage(MessageKeys.InvalidRefreshToken);
    }
}
