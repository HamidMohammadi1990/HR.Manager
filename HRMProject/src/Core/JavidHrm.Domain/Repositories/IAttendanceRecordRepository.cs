using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.AttendanceRecords;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IAttendanceRecordRepository
{
    void Add(AttendanceRecord attendanceRecord);
    void Remove(AttendanceRecord attendanceRecord);
    ValueTask<AttendanceRecord?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<AttendanceRecord?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<AttendanceRecord, bool>> expression, CancellationToken cancellationToken = default);
    Task<AttendanceRecord?> FindByEmployeeAndWorkDateAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllAttendanceRecordResponseDto>> GetAllAsync(
        GetAllAttendanceRecordRequestDto request,
        Expression<Func<AttendanceRecord, bool>>? contentFilter = null);
}
