using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public record DeleteRolePermissionRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(RolePermissionEncryptor))]
    public int Id { get; init; }
}
