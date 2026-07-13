using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyRecordAccesses.Queries;

public record GetAllContentPolicyRecordAccessRequest : IRequest<OperationResult<PagedResult<GetAllContentPolicyRecordAccessResponse>>>
{
    public int? PolicyId { get; init; }
    public string? EntityType { get; init; }
    public int? EntityId { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}

public record GetAllContentPolicyRecordAccessResponse
{
    public int Id { get; init; }
    public int PolicyId { get; init; }
    public int EntityId { get; init; }
    public string EntityType { get; init; }
    public string PolicyName { get; init; } = default!;
    public ContentPolicyEffect PolicyEffect { get; init; }
}
