using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Cities.Commands;

public class DeleteCityValidator : AbstractValidator<DeleteCityRequest>
{
    public DeleteCityValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
