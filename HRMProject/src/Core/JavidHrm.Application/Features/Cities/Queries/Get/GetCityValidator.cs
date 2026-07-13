using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Cities.Queries;

public class GetCityValidator : AbstractValidator<GetCityRequest>
{
    public GetCityValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
