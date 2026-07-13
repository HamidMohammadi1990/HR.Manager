using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public record CreateUserAddressRequest : IRequest<OperationResult<CreateUserAddressResponse>>
{
    public string Title { get; init; } = default!;
    public string Address { get; init; } = default!;
    public string? PostalCode { get; init; }

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }
    public string RecipientFirstName { get; init; } = default!;
    public string RecipientLastName { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
}