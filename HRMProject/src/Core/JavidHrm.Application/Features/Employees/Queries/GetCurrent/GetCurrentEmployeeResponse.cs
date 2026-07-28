using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Queries;

public record GetCurrentEmployeeResponse
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int Id { get; init; }

    public string EmployeeCode { get; init; } = default!;
    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
}
