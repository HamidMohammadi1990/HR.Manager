using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Permissions.Commands;

public record DeletePermissionRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(PermissionEncryptor))]
    public PermissionType Id { get; init; }
}
