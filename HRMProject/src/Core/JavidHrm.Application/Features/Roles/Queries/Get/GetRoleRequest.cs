using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Roles.Queries;

public record GetRoleRequest : IRequest<OperationResult<GetRoleResponse?>>
{
    [JsonConverter(typeof(RoleEncryptor))]
    public int Id { get; init; }
}