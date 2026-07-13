using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Employees.Commands;

public class DeleteEmployeeValidator : AbstractValidator<DeleteEmployeeRequest>
{
    public DeleteEmployeeValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
