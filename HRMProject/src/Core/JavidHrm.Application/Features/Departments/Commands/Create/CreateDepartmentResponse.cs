using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Commands;

public record CreateDepartmentResponse
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }
}
