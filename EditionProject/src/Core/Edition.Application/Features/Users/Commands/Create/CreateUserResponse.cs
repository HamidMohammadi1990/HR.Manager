using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Users.Commands;

public record CreateUserResponse
{
    [JsonConverter(typeof(UserEncryptor))]
    public int Id { get; init; }
}