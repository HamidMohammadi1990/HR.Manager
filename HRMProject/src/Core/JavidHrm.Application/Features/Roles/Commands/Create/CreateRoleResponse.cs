using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Roles.Commands;

public record CreateRoleResponse
{
    [JsonConverter(typeof(RoleEncryptor))]
    public int Id { get; init; }
}