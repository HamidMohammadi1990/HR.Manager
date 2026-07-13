using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Cities.Queries;

public record SearchCityRequest : IRequest<OperationResult<PagedResult<SearchCityResponse>>>, IContentPolicyFilteredRequest<City>
{
    [JsonConverter(typeof(ProvinceNullableEncryptor))]
    public int? ProvinceId { get; init; }

    public string? Name { get; init; }
    public string? Slug { get; private set; }
    public PagedRequest Pagination { get; init; } = default!;
}