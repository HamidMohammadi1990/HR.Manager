using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Banks;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class BankRepository
    (JavidHrmDbContext context)
    : Repository<Bank>(context), IBankRepository
{
    public async Task<PagedResult<Bank>> GetAllAsync(GetAllBankRequestDto request, Expression<Func<Bank, bool>>? contentFilter = null)
    {
        var banks = await Context.Bank
            .ApplyContentPolicyFilter(contentFilter)
            .ApplyQueryFilters(request)
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);

        return banks;
    }

    public async Task<PagedResult<Bank>> SearchAsync(SearchBankRequestDto request, Expression<Func<Bank, bool>>? contentFilter = null)
    {
        var banks = await Context.Bank
            .ApplyContentPolicyFilter(contentFilter)
            .Where(x => x.IsActive)
            .ApplyQueryFilters(request)
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
        
        return banks;
    }
}