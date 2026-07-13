using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Roles.Commands;

public record DeleteRoleRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(RoleEncryptor))]
    public int Id { get; init; }
}