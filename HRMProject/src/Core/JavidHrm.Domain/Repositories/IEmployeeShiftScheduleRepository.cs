using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IEmployeeShiftScheduleRepository
{
    void Add(EmployeeShiftSchedule schedule);
    void Remove(EmployeeShiftSchedule schedule);
    ValueTask<EmployeeShiftSchedule?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<EmployeeShiftSchedule?> FindActiveForDateAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default);
    Task<bool> HasOverlappingAsync(
        int employeeId,
        DateTime effectiveFrom,
        DateTime? effectiveTo,
        int? excludeScheduleId = null,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmployeeShiftSchedule>> GetByEmployeeIdAsync(
        int employeeId,
        CancellationToken cancellationToken = default);
}
