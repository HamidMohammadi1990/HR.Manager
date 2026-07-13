using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Users.Commands;

public record UpdateUserRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }

    public string UserName { get; init; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string? Email { get; init; }
    public string PhoneNumber { get; init; } = default!;
    public GenderType Gender { get; init; }
    public bool IsActive { get; init; }
    public bool LoginPermission { get; init; }
    public string? Password { get; init; }
}
