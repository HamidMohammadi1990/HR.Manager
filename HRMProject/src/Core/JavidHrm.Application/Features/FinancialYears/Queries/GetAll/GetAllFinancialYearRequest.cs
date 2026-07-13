using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public record GetAllFinancialYearRequest : IRequest<OperationResult<PagedResult<GetAllFinancialYearResponse>>>, IContentPolicyFilteredRequest<FinancialYear>
{
    public string? Name { get; init; }
    public bool? IsActive { get; init; } = true;

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int? DepartmentId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}