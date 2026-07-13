using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class ApprovePayrollEntryValidator : AbstractValidator<ApprovePayrollEntryRequest>
{
    public ApprovePayrollEntryValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
