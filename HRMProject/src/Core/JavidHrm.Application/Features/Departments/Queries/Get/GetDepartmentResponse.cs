using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Queries;

public record GetDepartmentResponse
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }

    public string Code { get; init; } = default!;
    public string Name { get; init; } = default!;
    public string? Email { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }

    public string Address { get; init; } = default!;
    public bool IsActive { get; init; }
    public float Latitude { get; init; }
    public float Longitude { get; init; }
    public string PostalCode { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
    public string? Description { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
