using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.ContentPolicyRules.Commands;

public class DeleteContentPolicyRuleValidator : AbstractValidator<DeleteContentPolicyRuleRequest>
{
    public DeleteContentPolicyRuleValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
