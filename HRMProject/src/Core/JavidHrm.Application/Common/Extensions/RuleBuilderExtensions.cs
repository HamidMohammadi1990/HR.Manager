using FluentValidation;
using JavidHrm.Common.Localization;
using System.Text.RegularExpressions;

namespace JavidHrm.Application.Common.Extensions;

public static class RuleBuilderExtensions
{
    private static readonly Regex IPRegex = new(
        @"^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\." +
        @"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\." +
        @"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\." +
        @"(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$",
        RegexOptions.Compiled);

    public static IRuleBuilderOptions<T, string> IsValidIP<T>(this IRuleBuilder<T, string> ruleBuilder)
    {
        return ruleBuilder
            .Must(ip => !string.IsNullOrEmpty(ip) && IPRegex.IsMatch(ip))
            .WithMessage(MessageKeys.InvalidIpAddress);
    }
}
