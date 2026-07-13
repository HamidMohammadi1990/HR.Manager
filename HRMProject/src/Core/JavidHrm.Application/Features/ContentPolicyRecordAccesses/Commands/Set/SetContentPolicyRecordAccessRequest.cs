using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Commands;

public record SetContentPolicyRecordAccessRequest : IRequest<OperationResult>
{
    public int PolicyId { get; init; }
    public List<int> EntityIds { get; init; } = [];
}
