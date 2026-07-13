using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public class GetFinancialYearValidator : AbstractValidator<GetFinancialYearRequest>
{
    public GetFinancialYearValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidId);
    }
}