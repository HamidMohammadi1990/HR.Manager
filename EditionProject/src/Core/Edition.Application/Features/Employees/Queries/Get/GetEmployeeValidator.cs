using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Employees.Queries;

public class GetEmployeeValidator : AbstractValidator<GetEmployeeRequest>
{
    public GetEmployeeValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
