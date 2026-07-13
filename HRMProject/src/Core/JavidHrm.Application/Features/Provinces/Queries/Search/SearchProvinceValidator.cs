using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Provinces.Queries;

public class SearchProvinceValidator : AbstractValidator<SearchProvinceRequest>
{
    public SearchProvinceValidator()
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.Province.Name);
    }
}
