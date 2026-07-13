using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Queries;

public class GetDepartmentValidator : AbstractValidator<GetDepartmentRequest>
{
    public GetDepartmentValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
