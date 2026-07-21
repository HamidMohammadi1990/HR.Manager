using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

public class DeleteLeaveTypeDefinitionValidator : AbstractValidator<DeleteLeaveTypeDefinitionRequest>
{
    public DeleteLeaveTypeDefinitionValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
