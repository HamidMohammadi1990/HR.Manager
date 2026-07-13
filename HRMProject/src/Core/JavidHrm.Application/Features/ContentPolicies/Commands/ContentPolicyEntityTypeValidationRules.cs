using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicies.Commands;

internal static class ContentPolicyEntityTypeValidationRules
{
    public static void ApplyRequiredEntityTypeRules<T>(
        AbstractValidator<T> validator,
        Func<T, string> entityTypeSelector,
        IContentEntityTypeRegistry entityTypeRegistry)
    {
        validator.RuleFor(x => entityTypeSelector(x))
            .NotEmpty()
            .WithMessage(MessageKeys.ContentPolicyEntityTypeRequired)
            .Must(entityTypeRegistry.IsRegistered)
            .WithMessage(MessageKeys.ContentPolicyEntityTypeNotRegistered);
    }

    public static void ApplyOptionalEntityTypeRules<T>(
        AbstractValidator<T> validator,
        Func<T, string?> entityTypeSelector,
        IContentEntityTypeRegistry entityTypeRegistry)
    {
        validator.When(x => entityTypeSelector(x) is not null, () =>
        {
            validator.RuleFor(x => entityTypeSelector(x)!)
                .NotEmpty()
                .WithMessage(MessageKeys.ContentPolicyEntityTypeRequired)
                .Must(entityTypeRegistry.IsRegistered)
                .WithMessage(MessageKeys.ContentPolicyEntityTypeNotRegistered);
        });
    }
}
