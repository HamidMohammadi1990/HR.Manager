using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserRoles.Commands;

public record DeleteUserRoleRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(UserRoleEncryptor))]
    public int Id { get; init; }
}
