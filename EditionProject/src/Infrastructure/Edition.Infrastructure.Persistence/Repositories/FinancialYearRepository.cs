using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.FinancialYears;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class FinancialYearRepository
    (JavidHrmDbContext context)
    : Repository<FinancialYear>(context), IFinancialYearRepository
{    
    public async Task<PagedResult<FinancialYear>> GetAllAsync(GetAllFinancialYearRequestDto request, Expression<Func<FinancialYear, bool>>? contentFilter = null)
    {
        var financialYears = Context.FinancialYear
            .AsQueryable()
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request);

        var result =
            await financialYears
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);

        return result;
    }

    public async Task<FinancialYear?> GetByDepartmentIdAsync(int departmentId)
    {
        return await Context
            .FinancialYear
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.DepartmentId == departmentId && x.IsActive);
    }

    public async Task<FinancialYear?> GetFirstActiveAsync(CancellationToken cancellationToken = default)
    {
        return await Context.FinancialYear
            .AsNoTracking()
            .Where(x => x.IsActive)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync(cancellationToken);
    }
}