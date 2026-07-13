using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveBalances;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Repositories;

public interface ILeaveBalanceRepository
{
    void Add(LeaveBalance leaveBalance);
    void Remove(LeaveBalance leaveBalance);
    ValueTask<LeaveBalance?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<LeaveBalance?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<LeaveBalance, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllLeaveBalanceResponseDto>> GetAllAsync(
        GetAllLeaveBalanceRequestDto request,
        Expression<Func<LeaveBalance, bool>>? contentFilter = null);
    Task<bool> ExistsAsync(
        int employeeId,
        LeaveType leaveType,
        int year,
        int? excludeId = null,
        CancellationToken cancellationToken = default);
}
