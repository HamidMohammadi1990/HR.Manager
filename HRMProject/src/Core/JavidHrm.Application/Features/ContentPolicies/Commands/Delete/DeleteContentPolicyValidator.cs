using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.ContentPolicies.Commands;

public class DeleteContentPolicyValidator : AbstractValidator<DeleteContentPolicyRequest>
{
    public DeleteContentPolicyValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
