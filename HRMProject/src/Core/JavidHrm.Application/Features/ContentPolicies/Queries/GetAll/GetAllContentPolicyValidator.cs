using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Application.Features.ContentPolicies.Commands;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public class GetAllContentPolicyValidator : AbstractValidator<GetAllContentPolicyRequest>
{
    public GetAllContentPolicyValidator(IContentEntityTypeRegistry entityTypeRegistry)
    {
        RuleFor(x => x.Pagination).MustBeValidPagination();
        RuleFor(x => x.RoleId).MustBeValidOptionalEntityId();
        RuleFor(x => x.UserId).MustBeValidOptionalEntityId();
        RuleFor(x => x.Name).MaximumLengthWhenNotEmpty(EntityFieldLengths.ContentPolicy.Name);

        ContentPolicyEntityTypeValidationRules.ApplyOptionalEntityTypeRules(
            this,
            x => x.EntityType,
            entityTypeRegistry);

        RuleFor(x => x.QueryAction)
            .IsInEnum()
            .When(x => x.QueryAction.HasValue)
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
