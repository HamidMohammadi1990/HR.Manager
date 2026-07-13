using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.ChartOfAccounts.Commands;

public class DeleteChartOfAccountValidator : AbstractValidator<DeleteChartOfAccountRequest>
{
    public DeleteChartOfAccountValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidChartOfAccountId);
    }
}
