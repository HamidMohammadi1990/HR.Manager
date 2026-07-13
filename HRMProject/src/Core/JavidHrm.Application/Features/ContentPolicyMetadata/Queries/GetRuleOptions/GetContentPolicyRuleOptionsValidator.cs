using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyRuleOptionsValidator : AbstractValidator<GetContentPolicyRuleOptionsRequest>
{
    public GetContentPolicyRuleOptionsValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
