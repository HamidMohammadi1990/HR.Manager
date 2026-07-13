using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Application.Features.ContentPolicies.Commands;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyPropertyOperatorsValidator : AbstractValidator<GetContentPolicyPropertyOperatorsRequest>
{
    public GetContentPolicyPropertyOperatorsValidator(IContentEntityTypeRegistry entityTypeRegistry)
    {
        ContentPolicyEntityTypeValidationRules.ApplyRequiredEntityTypeRules(
            this,
            x => x.EntityType,
            entityTypeRegistry);

        RuleFor(x => x.FieldPath)
            .NotEmpty()
            .WithMessage(MessageKeys.InvalidRequest)
            .MaximumLength(EntityFieldLengths.ContentPolicyRule.FieldPath)
            .WithMessage(MessageKeys.MaxLength150Characters);
    }
}
