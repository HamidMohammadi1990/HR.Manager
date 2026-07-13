using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using System.Text.Json.Serialization;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Cities.Queries;

public record GetAllCityRequest : IRequest<OperationResult<PagedResult<GetAllCityResponse>>>, IContentPolicyFilteredRequest<City>
{
    [JsonConverter(typeof(ProvinceNullableEncryptor))]
    public int? ProvinceId { get; init; }

    public string? Name { get; init; }
    public bool? IsActive { get; init; }
    public string? Slug { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}