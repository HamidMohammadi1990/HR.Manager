using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public record GetLeaveBalanceResponse
{
    [JsonConverter(typeof(LeaveBalanceEncryptor))]
    public int Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string? UserName { get; init; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string DepartmentName { get; init; } = default!;
    public string EmployeeCode { get; init; } = default!;
    public LeaveType LeaveType { get; init; }
    public int Year { get; init; }
    public decimal TotalDays { get; init; }
    public decimal UsedDays { get; init; }
    public decimal RemainingDays { get; init; }
}
