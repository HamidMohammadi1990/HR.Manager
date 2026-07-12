using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicies.Commands;

public record DeleteContentPolicyRequest : IRequest<OperationResult>
{
    public int Id { get; init; }
}
