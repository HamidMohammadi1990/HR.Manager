using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Provinces.Queries;

public class GetProvinceValidator : AbstractValidator<GetProvinceRequest>
{
    public GetProvinceValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
