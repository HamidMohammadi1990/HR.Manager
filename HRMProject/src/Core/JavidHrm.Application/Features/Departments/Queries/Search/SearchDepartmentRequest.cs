using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Departments.Queries;

public record SearchDepartmentRequest : IRequest<OperationResult<PagedResult<SearchDepartmentResponse>>>, IContentPolicyFilteredRequest<Department>
{
    [JsonConverter(typeof(ProvinceNullableEncryptor))]
    public int? ProvinceId { get; set; }

    [JsonConverter(typeof(CityNullableEncryptor))]
    public int? CityId { get; init; }

    public string? Name { get; init; }
    public string? Code { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; set; }

    public string? PostalCode { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
