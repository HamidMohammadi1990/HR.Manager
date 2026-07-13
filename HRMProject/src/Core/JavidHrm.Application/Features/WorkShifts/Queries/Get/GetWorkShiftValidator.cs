using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public class GetWorkShiftValidator : AbstractValidator<GetWorkShiftRequest>
{
    public GetWorkShiftValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
