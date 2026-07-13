using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public record CreateRolePermissionResponse
{
    [JsonConverter(typeof(RolePermissionEncryptor))]
    public int Id { get; init; }
}
