using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Commands;

public record CreateDepartmentRequest : IRequest<OperationResult<CreateDepartmentResponse>>
{
    public string Name { get; init; } = default!;
    public string Code { get; init; } = default!;
    public string? Description { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int? ParentDepartmentId { get; init; }

    [JsonConverter(typeof(WorkShiftNullableEncryptor))]
    public int? DefaultWorkShiftId { get; init; }

    public bool IsActive { get; init; } = true;
}
