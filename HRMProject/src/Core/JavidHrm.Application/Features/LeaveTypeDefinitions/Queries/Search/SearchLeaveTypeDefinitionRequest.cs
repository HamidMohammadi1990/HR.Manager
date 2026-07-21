using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public record SearchLeaveTypeDefinitionRequest : IRequest<OperationResult<PagedResult<SearchLeaveTypeDefinitionResponse>>>, IContentPolicyFilteredRequest<LeaveTypeDefinition>
{
    public string? Code { get; init; }
    public string? Name { get; init; }
    public LeaveTypeCategory? Category { get; init; }
    public LeaveTypeUnit? Unit { get; init; }
    public bool? IsPaid { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
