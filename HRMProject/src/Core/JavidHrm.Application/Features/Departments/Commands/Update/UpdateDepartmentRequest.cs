using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Commands;

public record UpdateDepartmentRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }

    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string PostalCode { get; init; } = default!;
    public string Address { get; init; } = default!;
    public string Description { get; init; } = default!;
    public float Latitude { get; init; }
    public float Longitude { get; init; }
    public bool IsActive { get; init; }
}
