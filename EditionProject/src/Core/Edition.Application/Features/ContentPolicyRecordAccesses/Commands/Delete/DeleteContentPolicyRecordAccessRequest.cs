using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Commands;

public record DeleteContentPolicyRecordAccessRequest : IRequest<OperationResult>
{
    public int Id { get; init; }
}
