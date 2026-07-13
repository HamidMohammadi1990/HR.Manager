using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Queries;

public class SearchDepartmentValidator : AbstractValidator<SearchDepartmentRequest>
{
    public SearchDepartmentValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.Company.Name);
        RuleFor(x => x.Code).MaximumLengthWhenNotEmpty(EntityFieldLengths.Company.Code);
        RuleFor(x => x.PostalCode).MaximumLengthWhenNotEmpty(EntityFieldLengths.Company.PostalCode);
    }
}
