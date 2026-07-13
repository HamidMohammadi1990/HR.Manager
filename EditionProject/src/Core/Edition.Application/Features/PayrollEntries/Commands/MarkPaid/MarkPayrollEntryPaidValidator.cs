using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class MarkPayrollEntryPaidValidator : AbstractValidator<MarkPayrollEntryPaidRequest>
{
    public MarkPayrollEntryPaidValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
