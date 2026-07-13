using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Provinces.Queries;

public record GetAllProvinceRequest : IRequest<OperationResult<PagedResult<GetAllProvinceResponse>>>, IContentPolicyFilteredRequest<Province>
{
    public string? Name { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}