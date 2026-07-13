using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetAllUserAddressRequest : IRequest<OperationResult<PagedResult<GetAllUserAddressResponse>>>, IContentPolicyFilteredRequest<UserAddress>
{
    public string? Title { get; init; }

    [JsonConverter(typeof(CityNullableEncryptor))]
    public int? CityId { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public bool? IsActive { get; init; }
    public string? PostalCode { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}