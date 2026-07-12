using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public record GetContentPolicyRequest : IRequest<OperationResult<GetContentPolicyResponse?>>
{
    public int Id { get; init; }
}
