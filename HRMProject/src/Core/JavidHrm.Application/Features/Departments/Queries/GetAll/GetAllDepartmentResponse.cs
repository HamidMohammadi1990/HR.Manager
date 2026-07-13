using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Queries;

public record GetAllDepartmentResponse
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }

    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }

    public string CityName { get; init; } = default!;
    public bool IsActive { get; init; }
    public string Address { get; init; } = default!;
    public string? Email { get; init; }
    public float Latitude { get; init; }
    public float Longitude { get; init; }
    public string PhoneNumber { get; init; } = default!;
    public string PostalCode { get; init; } = default!;

    [JsonConverter(typeof(ProvinceEncryptor))]
    public int ProvinceId { get; init; }

    public string ProvinceName { get; init; } = default!;

    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
