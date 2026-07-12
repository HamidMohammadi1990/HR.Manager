using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Permissions.Queries;

public record GetAllPermissionResponse
{
    [JsonConverter(typeof(PermissionEncryptor))]
    public PermissionType Id { get; init; }
    public string Title { get; init; } = null!;
    public string Url { get; init; } = null!;
    public string? NameSpace { get; init; }

    [JsonConverter(typeof(PermissionNullableEncryptor))]
    public PermissionType? ParentId { get; init; }
    public PermissionLevelType LevelTypeId { get; init; }
    public string LevelTypeTitle { get; init; } = default!;
    public int Priority { get; init; }
    public bool IsActive { get; init; }
}