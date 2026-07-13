using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Provinces.Commands;

public class DeleteProvinceValidator : AbstractValidator<DeleteProvinceRequest>
{
    public DeleteProvinceValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
