using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Application.Contracts.ContentPolicies;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public record GetUserAddressesRequest : IRequest<OperationResult<PagedResult<GetUserAddressesResponse>>>, IContentPolicyFilteredRequest<UserAddress>
{
    public string? Title { get; init; }

    [JsonConverter(typeof(CityNullableEncryptor))]
    public int? CityId { get; init; }

    public string? PostalCode { get; init; }

    public bool? IsActive { get; init; } = true;

    public PagedRequest Pagination { get; init; } = default!;

    ContentPolicyQueryAction? IContentPolicyFilteredRequest.ContentPolicyQueryAction
        => ContentPolicyQueryAction.GetUserAddresses;
}