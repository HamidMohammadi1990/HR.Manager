using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class DeleteWorkShiftValidator : AbstractValidator<DeleteWorkShiftRequest>
{
    public DeleteWorkShiftValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
