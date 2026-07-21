using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.WorkShifts;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IWorkShiftRepository
{
    void Add(WorkShift workShift);
    void Remove(WorkShift workShift);
    ValueTask<WorkShift?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<WorkShift?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<WorkShift, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllWorkShiftResponseDto>> GetAllAsync(
        GetAllWorkShiftRequestDto request,
        Expression<Func<WorkShift, bool>>? contentFilter = null);
    Task<bool> IsInUseAsync(int workShiftId, CancellationToken cancellationToken = default);
}
