using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public class DeleteUserAddressValidator : AbstractValidator<DeleteUserAddressRequest>
{
    public DeleteUserAddressValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
