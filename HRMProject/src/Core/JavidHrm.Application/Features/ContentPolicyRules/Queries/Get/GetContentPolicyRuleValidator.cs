using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.ContentPolicyRules.Queries;

public class GetContentPolicyRuleValidator : AbstractValidator<GetContentPolicyRuleRequest>
{
    public GetContentPolicyRuleValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
