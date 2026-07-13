using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetUserAddressValidator : AbstractValidator<GetUserAddressRequest>
{
    public GetUserAddressValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
