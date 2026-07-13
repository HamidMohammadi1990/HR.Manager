using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.WorkShifts;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class WorkShiftRepository(JavidHrmDbContext context)
    : Repository<WorkShift>(context), IWorkShiftRepository
{
    public async Task<PagedResult<GetAllWorkShiftResponseDto>> GetAllAsync(
        GetAllWorkShiftRequestDto request,
        Expression<Func<WorkShift, bool>>? contentFilter = null)
    {
        var requestSource = Context.WorkShift.ApplyContentPolicyFilter(contentFilter);

        var workShifts =
            from workShift in requestSource
            select new { workShift };

        workShifts = workShifts.ApplyQueryFilters(request);

        return await workShifts
            .OrderBy(x => x.workShift.Name)
            .Select(x => new GetAllWorkShiftResponseDto
            {
                Id = x.workShift.Id,
                Name = x.workShift.Name,
                StartTime = x.workShift.StartTime,
                EndTime = x.workShift.EndTime,
                BreakMinutes = x.workShift.BreakMinutes,
                IsActive = x.workShift.IsActive,
                Description = x.workShift.Description
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
