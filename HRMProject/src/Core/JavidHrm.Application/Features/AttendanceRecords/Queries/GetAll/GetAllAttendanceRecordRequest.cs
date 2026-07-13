using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public record GetAllAttendanceRecordRequest : IRequest<OperationResult<PagedResult<GetAllAttendanceRecordResponse>>>, IContentPolicyFilteredRequest<AttendanceRecord>
{
    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? EmployeeId { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public DateTime? WorkDate { get; init; }
    public DateTime? WorkDateFrom { get; init; }
    public DateTime? WorkDateTo { get; init; }
    public AttendanceStatus? Status { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? EmployeeCode { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
