using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Commands;

public record CreateEmployeeResponse
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int Id { get; init; }
}
