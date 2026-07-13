using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserRoles.Commands;

public record CreateUserRoleResponse
{
    [JsonConverter(typeof(UserRoleEncryptor))]
    public int Id { get; init; }
}
