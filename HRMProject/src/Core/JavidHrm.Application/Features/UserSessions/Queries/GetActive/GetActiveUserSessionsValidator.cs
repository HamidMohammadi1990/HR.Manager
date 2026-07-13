using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.UserSessions.Queries;

public class GetActiveUserSessionsValidator : AbstractValidator<GetActiveUserSessionsRequest>
{
    public GetActiveUserSessionsValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
