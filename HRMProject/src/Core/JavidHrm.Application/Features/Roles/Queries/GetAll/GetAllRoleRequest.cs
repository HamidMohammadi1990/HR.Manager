using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Roles.Queries;

public record GetAllRoleRequest : IRequest<OperationResult<PagedResult<GetAllRoleResponse>>>, IContentPolicyFilteredRequest<Role>
{
    public string? Title { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}