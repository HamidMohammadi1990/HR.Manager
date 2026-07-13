using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetPayrollPayslipPdfValidator : AbstractValidator<GetPayrollPayslipPdfRequest>
{
    public GetPayrollPayslipPdfValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
