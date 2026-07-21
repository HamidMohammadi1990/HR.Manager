using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface ILeaveRequestRepository
{
    void Add(LeaveRequest leaveRequest);
    void Remove(LeaveRequest leaveRequest);
    ValueTask<LeaveRequest?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<LeaveRequest?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<LeaveRequest, bool>> expression, CancellationToken cancellationToken = default);
    Task<bool> HasOverlappingAsync(
        int employeeId,
        DateTime startDate,
        DateTime endDate,
        int? excludeLeaveRequestId = null,
        CancellationToken cancellationToken = default);
    Task<LeaveRequest?> FindWithApprovalStepsAsync(int id, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllLeaveRequestResponseDto>> GetAllAsync(
        GetAllLeaveRequestRequestDto request,
        Expression<Func<LeaveRequest, bool>>? contentFilter = null);
}
