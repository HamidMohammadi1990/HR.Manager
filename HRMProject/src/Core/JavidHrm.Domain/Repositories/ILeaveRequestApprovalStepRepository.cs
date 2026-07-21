using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface ILeaveRequestApprovalStepRepository
{
    void Add(LeaveRequestApprovalStep step);
    void AddRange(IEnumerable<LeaveRequestApprovalStep> steps);
    void RemoveRange(IEnumerable<LeaveRequestApprovalStep> steps);
    Task<IReadOnlyList<LeaveRequestApprovalStep>> GetByLeaveRequestIdAsync(
        int leaveRequestId,
        CancellationToken cancellationToken = default);
    Task<PagedResult<LeaveApprovalInboxItemDto>> GetInboxAsync(
        int? approverEmployeeId,
        bool includeHrPoolSteps,
        PagedRequest pagination,
        CancellationToken cancellationToken = default);
}
