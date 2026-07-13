using FluentValidation;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public class GetAllWorkShiftValidator : AbstractValidator<GetAllWorkShiftRequest>
{
    public GetAllWorkShiftValidator() => RuleFor(x => x.Pagination).NotNull();
}
