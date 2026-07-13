using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public class GetAllFinancialYearValidator : AbstractValidator<GetAllFinancialYearRequest>
{
    public GetAllFinancialYearValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.DepartmentId).MustBeValidOptionalEntityId();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.FinancialYear.Title);
    }
}
