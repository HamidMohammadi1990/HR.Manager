using FluentValidation;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyEntityTypesValidator : AbstractValidator<GetContentPolicyEntityTypesRequest>
{
    public GetContentPolicyEntityTypesValidator()
    {
        RuleFor(x => x)
            .NotNull()
            .WithMessage(MessageKeys.InvalidRequest);
    }
}
