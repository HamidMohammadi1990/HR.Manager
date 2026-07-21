using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class CreateWorkShiftValidator : AbstractValidator<CreateWorkShiftRequest>
{
    public CreateWorkShiftValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500);
        RuleFor(x => x.Color).MaximumLength(20);
        RuleFor(x => x.BreakMinutes).GreaterThanOrEqualTo(0);
        RuleFor(x => x.GraceMinutes).GreaterThanOrEqualTo(0);
        RuleFor(x => x.EarlyLeaveGraceMinutes).GreaterThanOrEqualTo(0);
        RuleFor(x => x)
            .Must(r => r.IsOvernight || r.EndTime > r.StartTime)
            .WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
        RuleFor(x => x)
            .Must(r => !r.IsOvernight || r.EndTime != r.StartTime)
            .WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
    }
}
