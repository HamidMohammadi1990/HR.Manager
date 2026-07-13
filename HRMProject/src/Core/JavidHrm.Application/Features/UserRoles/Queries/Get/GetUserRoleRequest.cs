using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserRoles.Queries;

public record GetUserRoleRequest : IRequest<OperationResult<GetUserRoleResponse?>>
{
    [JsonConverter(typeof(UserRoleEncryptor))]
    public int Id { get; init; }
}
