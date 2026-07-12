using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Departments.Commands;

public class DeleteDepartmentValidator : AbstractValidator<DeleteDepartmentRequest>
{
    public DeleteDepartmentValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
