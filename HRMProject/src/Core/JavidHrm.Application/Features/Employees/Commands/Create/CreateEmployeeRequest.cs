using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Commands;

public record CreateEmployeeRequest : IRequest<OperationResult<CreateEmployeeResponse>>
{
    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? ManagerId { get; init; }

    [JsonConverter(typeof(WorkShiftNullableEncryptor))]
    public int? WorkShiftId { get; init; }

    public string EmployeeCode { get; init; } = default!;
    public string JobTitle { get; init; } = default!;
    public DateTime HireDate { get; init; }
    public bool IsActive { get; init; } = true;
}
