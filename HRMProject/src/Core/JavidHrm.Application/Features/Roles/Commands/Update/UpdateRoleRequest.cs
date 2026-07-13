using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Roles.Commands;

public record UpdateRoleRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(RoleEncryptor))]
    public int Id { get; init; }

    public string Title { get; init; } = default!;

    public bool IsActive { get; init; }
}