using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Permissions.Queries;

public record GetPermissionRequest : IRequest<OperationResult<GetPermissionResponse?>>
{
    [JsonConverter(typeof(PermissionEncryptor))]
    public PermissionType Id { get; init; }
}