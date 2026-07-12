using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record GetAllLeaveRequestRequest : IRequest<OperationResult<PagedResult<GetAllLeaveRequestResponse>>>, IContentPolicyFilteredRequest<LeaveRequest>
{
    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? EmployeeId { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    public LeaveType? LeaveType { get; init; }
    public LeaveRequestStatus? Status { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? EmployeeCode { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
