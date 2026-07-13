using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public record GetAllWorkShiftRequest : IRequest<OperationResult<PagedResult<GetAllWorkShiftResponse>>>, IContentPolicyFilteredRequest<WorkShift>
{
    public string? Name { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
