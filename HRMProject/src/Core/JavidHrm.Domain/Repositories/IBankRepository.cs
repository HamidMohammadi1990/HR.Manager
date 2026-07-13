using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Banks;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IBankRepository
{
    Task<PagedResult<Bank>> GetAllAsync(GetAllBankRequestDto request, Expression<Func<Bank, bool>>? contentFilter = null);
    Task<PagedResult<Bank>> SearchAsync(SearchBankRequestDto request, Expression<Func<Bank, bool>>? contentFilter = null);
    void Add(Bank bank);
    void Remove(Bank bank);
    ValueTask<Bank?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Bank?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Bank, bool>> expression, CancellationToken cancellationToken = default);
}