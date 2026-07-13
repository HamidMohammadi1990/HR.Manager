using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public record GetAllLeaveBalanceRequest : IRequest<OperationResult<PagedResult<GetAllLeaveBalanceResponse>>>, IContentPolicyFilteredRequest<LeaveBalance>
{
    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? EmployeeId { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    public LeaveType? LeaveType { get; init; }
    public int? Year { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
