using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.PayrollEntries;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IPayrollEntryRepository
{
    void Add(PayrollEntry payrollEntry);
    void Remove(PayrollEntry payrollEntry);
    ValueTask<PayrollEntry?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<PayrollEntry?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<PayrollEntry, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllPayrollEntryResponseDto>> GetAllAsync(
        GetAllPayrollEntryRequestDto request,
        Expression<Func<PayrollEntry, bool>>? contentFilter = null);
}
