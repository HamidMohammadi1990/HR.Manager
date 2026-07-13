using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public record GetRolePermissionResponse
{
    [JsonConverter(typeof(RolePermissionEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(RoleEncryptor))]
    public int RoleId { get; init; }

    public string RoleTitle { get; init; } = default!;

    [JsonConverter(typeof(PermissionEncryptor))]
    public PermissionType PermissionId { get; init; }

    public string PermissionTitle { get; init; } = default!;
}
