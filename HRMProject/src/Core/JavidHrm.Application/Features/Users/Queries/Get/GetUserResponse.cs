using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetUserResponse
{
    [JsonConverter(typeof(UserEncryptor))]
    public int Id { get; init; }
    public string UserName { get; init; } = default!;
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Email { get; init; }
    public string? PhoneNumber { get; init; }
    public GenderType? Gender { get; init; }
    public bool IsActive { get; init; }
    public bool LoginPermission { get; init; }
    public DateTime? LastLoginDateOnUtc { get; init; }

    [JsonConverter(typeof(CityNullableEncryptor))]
    public int? CityId { get; init; }
}