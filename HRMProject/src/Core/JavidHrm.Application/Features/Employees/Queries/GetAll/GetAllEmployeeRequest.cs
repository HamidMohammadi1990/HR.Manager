using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Employees.Queries;

public record GetAllEmployeeRequest : IRequest<OperationResult<PagedResult<GetAllEmployeeResponse>>>, IContentPolicyFilteredRequest<Employee>
{
    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    [JsonConverter(typeof(EmployeeNullableEncryptor))]
    public int? ManagerId { get; init; }

    public string? EmployeeCode { get; init; }
    public string? JobTitle { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
