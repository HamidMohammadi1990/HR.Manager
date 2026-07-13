using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetPayrollEntryValidator : AbstractValidator<GetPayrollEntryRequest>
{
    public GetPayrollEntryValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
