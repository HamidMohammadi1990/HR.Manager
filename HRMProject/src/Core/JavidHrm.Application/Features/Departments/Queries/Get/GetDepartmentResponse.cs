using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Queries;

public record GetDepartmentResponse
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }

    public string Code { get; init; } = default!;
    public string Name { get; init; } = default!;

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int? ParentDepartmentId { get; init; }

    public string? ParentDepartmentName { get; init; }

    [JsonConverter(typeof(WorkShiftNullableEncryptor))]
    public int? DefaultWorkShiftId { get; init; }

    public string? DefaultWorkShiftName { get; init; }
    public bool IsActive { get; init; }
    public string? Description { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
