using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Queries;

public record SearchDepartmentResponse
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }

    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int? ParentDepartmentId { get; init; }

    public string? ParentDepartmentName { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
