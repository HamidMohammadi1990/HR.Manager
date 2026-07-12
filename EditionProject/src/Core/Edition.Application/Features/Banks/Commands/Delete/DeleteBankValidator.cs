using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.Banks.Commands;

public class DeleteBankValidator : AbstractValidator<DeleteBankRequest>
{
    public DeleteBankValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
