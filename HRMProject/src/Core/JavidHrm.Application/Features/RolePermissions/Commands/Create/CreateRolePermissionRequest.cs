using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public record CreateRolePermissionRequest : IRequest<OperationResult<CreateRolePermissionResponse>>
{
    [JsonConverter(typeof(RoleEncryptor))]
    public int RoleId { get; init; }

    [JsonConverter(typeof(PermissionEncryptor))]
    public PermissionType PermissionId { get; init; }
}
