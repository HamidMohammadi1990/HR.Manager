using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.FinancialYears;
using System.Linq.Expressions;

namespace JavidHrm.Domain.Repositories;

public interface IFinancialYearRepository
{
    void Add(FinancialYear chartOfAccount);
    Task<PagedResult<FinancialYear>> GetAllAsync(GetAllFinancialYearRequestDto request, Expression<Func<FinancialYear, bool>>? contentFilter = null);
    ValueTask<FinancialYear?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<FinancialYear?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<FinancialYear?> GetByDepartmentIdAsync(int departmentId);

    Task<FinancialYear?> GetFirstActiveAsync(CancellationToken cancellationToken = default);
}