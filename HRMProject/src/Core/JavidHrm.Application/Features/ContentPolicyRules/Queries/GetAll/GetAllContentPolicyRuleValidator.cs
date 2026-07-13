using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Application.Features.ContentPolicies.Commands;

namespace JavidHrm.Application.Features.ContentPolicyRules.Queries;

public class GetAllContentPolicyRuleValidator : AbstractValidator<GetAllContentPolicyRuleRequest>
{
    public GetAllContentPolicyRuleValidator(IContentEntityTypeRegistry entityTypeRegistry)
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.PolicyId).MustBeValidOptionalEntityId();
        RuleFor(x => x.FieldPath).MaximumLengthWhenNotEmpty(EntityFieldLengths.ContentPolicyRule.FieldPath);

        ContentPolicyEntityTypeValidationRules.ApplyOptionalEntityTypeRules(
            this,
            x => x.EntityType,
            entityTypeRegistry);

        RuleFor(x => x.RuleGroup)
            .IsInEnum()
            .When(x => x.RuleGroup.HasValue)
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
