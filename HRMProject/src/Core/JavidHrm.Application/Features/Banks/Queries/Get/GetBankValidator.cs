using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Banks.Queries;

public class GetBankValidator : AbstractValidator<GetBankRequest>
{
    public GetBankValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
