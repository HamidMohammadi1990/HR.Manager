using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public record CreateUserAddressResponse
{
    [JsonConverter(typeof(UserAddressEncryptor))]
    public int Id { get; init; }
}