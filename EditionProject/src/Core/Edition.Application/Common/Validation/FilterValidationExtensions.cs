using JavidHrm.Common.Localization;
using FluentValidation;

namespace JavidHrm.Application.Common.Validation;

public static class FilterValidationExtensions
{
    public static IRuleBuilderOptions<T, string?> MaximumLengthWhenNotEmpty<T>(
        this IRuleBuilder<T, string?> ruleBuilder,
        int maxLength)
        => ruleBuilder
            .Must(value => string.IsNullOrWhiteSpace(value) || value.Length <= maxLength)
            .WithMessage(MessageKeys.InvalidRequest);
}
