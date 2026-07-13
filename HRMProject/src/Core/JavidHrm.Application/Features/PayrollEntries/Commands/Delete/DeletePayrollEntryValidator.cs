using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class DeletePayrollEntryValidator : AbstractValidator<DeletePayrollEntryRequest>
{
    public DeletePayrollEntryValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
