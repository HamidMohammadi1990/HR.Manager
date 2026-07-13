using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.FinancialYears.Commands;

public class DeleteFinancialYearValidator : AbstractValidator<DeleteFinancialYearRequest>
{
    public DeleteFinancialYearValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage(MessageKeys.InvalidIdValidator);
    }
}