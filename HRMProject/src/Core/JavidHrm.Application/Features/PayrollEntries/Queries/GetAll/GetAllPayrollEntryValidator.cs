using FluentValidation;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetAllPayrollEntryValidator : AbstractValidator<GetAllPayrollEntryRequest>
{
    public GetAllPayrollEntryValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
