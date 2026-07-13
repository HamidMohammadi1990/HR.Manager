using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicies.Queries;

public record GetAllContentPolicyRequest : IRequest<OperationResult<PagedResult<GetAllContentPolicyResponse>>>
{
    public int? RoleId { get; init; }
    public int? UserId { get; init; }
    public string? EntityType { get; init; }
    public ContentPolicyQueryAction? QueryAction { get; init; }
    public bool? IsActive { get; init; }
    public string? Name { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
