using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Departments.Queries;

public record SearchDepartmentRequest : IRequest<OperationResult<PagedResult<SearchDepartmentResponse>>>, IContentPolicyFilteredRequest<Department>
{
    public string? Name { get; init; }
    public string? Code { get; init; }

    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; set; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? ParentDepartmentId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
