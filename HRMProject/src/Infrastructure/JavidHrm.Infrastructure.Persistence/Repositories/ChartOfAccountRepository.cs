using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ChartOfAccounts;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class ChartOfAccountRepository
    (JavidHrmDbContext context)
    : Repository<ChartOfAccount>(context), IChartOfAccountRepository
{
    public async Task<PagedResult<GetAllChartOfAccountDto>> GetAllAsync(GetAllChartOfAccountRequestDto request, Expression<Func<ChartOfAccount, bool>>? contentFilter = null)
    {
        var accounts = Context.ChartOfAccount
            .ApplyContentPolicyFilter(contentFilter);

        var result =
            await accounts
            .Select(x => new GetAllChartOfAccountDto
            {
                Id = x.Id,
                Level = x.Level,
                ParentId = x.ParentId,
                AccountType = x.AccountType,
                AccountCode = x.AccountCode,
                AccountTitle = x.AccountTitle,
                AccountDetailType = x.AccountDetailType
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);

        return result;
    }
}