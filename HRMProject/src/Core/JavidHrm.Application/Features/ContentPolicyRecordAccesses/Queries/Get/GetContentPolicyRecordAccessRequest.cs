using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Queries;

public record GetContentPolicyRecordAccessRequest : IRequest<OperationResult<GetContentPolicyRecordAccessResponse?>>
{
    public int Id { get; init; }
}

public record GetContentPolicyRecordAccessResponse
{
    public int Id { get; init; }
    public int PolicyId { get; init; }
    public int EntityId { get; init; }
    public string EntityType { get; init; }
    public string PolicyName { get; init; } = default!;
    public ContentPolicyEffect PolicyEffect { get; init; }
}
