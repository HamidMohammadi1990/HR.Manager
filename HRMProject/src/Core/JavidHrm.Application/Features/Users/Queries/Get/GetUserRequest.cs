using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetUserRequest : IRequest<OperationResult<GetUserResponse?>>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int Id { get; init; }
}