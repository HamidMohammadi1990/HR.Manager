using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Commands;

public record CreateContentPolicyRecordAccessRequest : IRequest<OperationResult<CreateContentPolicyRecordAccessResponse>>
{
    public int PolicyId { get; init; }
    public int EntityId { get; init; }
}

public record CreateContentPolicyRecordAccessResponse
{
    public int Id { get; init; }
}
