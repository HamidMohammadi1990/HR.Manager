using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public class GetContentPolicyValidator : AbstractValidator<GetContentPolicyRequest>
{
    public GetContentPolicyValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
