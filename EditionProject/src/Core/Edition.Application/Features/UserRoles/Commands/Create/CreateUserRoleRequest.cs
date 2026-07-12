using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserRoles.Commands;

public record CreateUserRoleRequest : IRequest<OperationResult<CreateUserRoleResponse>>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    [JsonConverter(typeof(RoleEncryptor))]
    public int RoleId { get; init; }
}