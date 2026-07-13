using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class UpdateWorkShiftValidator : AbstractValidator<UpdateWorkShiftRequest>
{
    public UpdateWorkShiftValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500);
        RuleFor(x => x.BreakMinutes).GreaterThanOrEqualTo(0);
        RuleFor(x => x).Must(r => r.EndTime > r.StartTime).WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
    }
}
