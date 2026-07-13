using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyRules.Commands;

public record DeleteContentPolicyRuleRequest : IRequest<OperationResult>
{
    public int Id { get; init; }
}
