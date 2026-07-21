using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Queries;

public class GetAllDepartmentValidator : AbstractValidator<GetAllDepartmentRequest>
{
    public GetAllDepartmentValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.Department.Name);
        RuleFor(x => x.Code).MaximumLengthWhenNotEmpty(EntityFieldLengths.Department.Code);
    }
}
