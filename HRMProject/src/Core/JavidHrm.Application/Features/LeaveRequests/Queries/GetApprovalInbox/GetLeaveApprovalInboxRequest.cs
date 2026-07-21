using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public record GetLeaveApprovalInboxRequest : IRequest<OperationResult<PagedResult<GetLeaveApprovalInboxResponse>>>
{
    public PagedRequest Pagination { get; init; } = default!;
}
