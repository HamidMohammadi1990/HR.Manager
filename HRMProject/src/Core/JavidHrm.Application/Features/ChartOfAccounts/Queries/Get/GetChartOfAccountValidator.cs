using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public class GetChartOfAccountValidator : AbstractValidator<GetChartOfAccountRequest>
{
    public GetChartOfAccountValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidIdValidator);
    }
}
