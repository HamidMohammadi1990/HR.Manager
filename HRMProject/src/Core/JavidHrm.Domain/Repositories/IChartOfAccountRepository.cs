using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ChartOfAccounts;

namespace JavidHrm.Domain.Repositories;

public interface IChartOfAccountRepository
{
    Task<ChartOfAccount?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    void Add(ChartOfAccount chartOfAccount);
    void Remove(ChartOfAccount chartOfAccount);
    ValueTask<ChartOfAccount?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllChartOfAccountDto>> GetAllAsync(GetAllChartOfAccountRequestDto request, Expression<Func<ChartOfAccount, bool>>? contentFilter = null);
}