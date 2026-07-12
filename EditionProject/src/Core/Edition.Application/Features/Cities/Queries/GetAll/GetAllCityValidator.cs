using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Cities.Queries;

public class GetAllCityValidator : AbstractValidator<GetAllCityRequest>
{
    public GetAllCityValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.ProvinceId).MustBeValidOptionalEntityId();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.City.Name);
        RuleFor(x => x.Slug).MaximumLengthWhenNotEmpty(EntityFieldLengths.City.Slug);
    }
}
