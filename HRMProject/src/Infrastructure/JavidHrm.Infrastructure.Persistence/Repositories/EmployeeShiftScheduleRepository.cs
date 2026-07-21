using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class EmployeeShiftScheduleRepository(JavidHrmDbContext context)
    : Repository<EmployeeShiftSchedule>(context), IEmployeeShiftScheduleRepository
{
    public Task<EmployeeShiftSchedule?> FindActiveForDateAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default)
    {
        var date = workDate.Date;
        return Context.EmployeeShiftSchedule
            .AsNoTracking()
            .Where(x =>
                x.EmployeeId == employeeId
                && x.EffectiveFrom <= date
                && (x.EffectiveTo == null || x.EffectiveTo >= date))
            .OrderByDescending(x => x.EffectiveFrom)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public Task<bool> HasOverlappingAsync(
        int employeeId,
        DateTime effectiveFrom,
        DateTime? effectiveTo,
        int? excludeScheduleId = null,
        CancellationToken cancellationToken = default)
    {
        var from = effectiveFrom.Date;
        var to = effectiveTo?.Date;

        return Context.EmployeeShiftSchedule.AnyAsync(
            schedule =>
                schedule.EmployeeId == employeeId
                && (excludeScheduleId == null || schedule.Id != excludeScheduleId)
                && schedule.EffectiveFrom <= (to ?? DateTime.MaxValue.Date)
                && (schedule.EffectiveTo == null || schedule.EffectiveTo >= from),
            cancellationToken);
    }

    public async Task<IReadOnlyList<EmployeeShiftSchedule>> GetByEmployeeIdAsync(
        int employeeId,
        CancellationToken cancellationToken = default)
    {
        var items = await Context.EmployeeShiftSchedule
            .AsNoTracking()
            .Include(x => x.WorkShift)
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.EffectiveFrom)
            .ToListAsync(cancellationToken);

        return items;
    }
}
