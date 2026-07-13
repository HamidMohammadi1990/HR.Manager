using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Provinces.Queries;

public record SearchProvinceRequest : IRequest<OperationResult<PagedResult<SearchProvinceResponse>>>, IContentPolicyFilteredRequest<Province>
{
    public string? Name { get; init; }    
    public PagedRequest Pagination { get; init; } = default!;
}