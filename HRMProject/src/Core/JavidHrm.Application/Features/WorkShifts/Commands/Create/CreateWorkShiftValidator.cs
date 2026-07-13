using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class CreateWorkShiftValidator : AbstractValidator<CreateWorkShiftRequest>
{
    public CreateWorkShiftValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500);
        RuleFor(x => x.BreakMinutes).GreaterThanOrEqualTo(0);
        RuleFor(x => x).Must(r => r.EndTime > r.StartTime).WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
    }
}
