using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Queries;

public record GetAllEmployeeResponse
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(UserEncryptor))]
    public int UserId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string DepartmentName { get; init; } = default!;

    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? ManagerId { get; init; }

    public string? ManagerFirstName { get; init; }
    public string? ManagerLastName { get; init; }
    public string EmployeeCode { get; init; } = default!;
    public string JobTitle { get; init; } = default!;
    public DateTime HireDate { get; init; }
    public bool IsActive { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}
