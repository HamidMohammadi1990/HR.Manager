using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public class UpdateUserAddressRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(UserAddressEncryptor))]
    public int Id { get; init; }

    public string Title { get; init; } = default!;
    public bool IsActive { get; init; }
    public string Address { get; init; } = default!;
    public string? PostalCode { get; init; }

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }
    public string RecipientFirstName { get; init; } = default!;
    public string RecipientLastName { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
}