using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public record GetRolePermissionRequest : IRequest<OperationResult<GetRolePermissionResponse?>>
{
    [JsonConverter(typeof(RolePermissionEncryptor))]
    public int Id { get; init; }
}
