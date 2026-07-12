using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class ContentPolicyRuleRepository
    (JavidHrmDbContext context)
    : Repository<ContentPolicyRule>(context), IContentPolicyRuleRepository
{
    public async Task<ContentPolicyRule?> FindWithPolicyAsync(int id, CancellationToken cancellationToken = default)
        => await Context.ContentPolicyRule
            .Include(x => x.Policy)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<PagedResult<ContentPolicyRule>> GetAllAsync(GetAllContentPolicyRuleRequestDto request, CancellationToken cancellationToken = default)
    {
        var query = Context.ContentPolicyRule
            .Include(x => x.Policy)
            .AsNoTracking()
            .AsQueryable()
            .ApplyQueryFilters(request);

        return await query
            .OrderBy(x => x.PolicyId)
            .ThenBy(x => x.RuleGroup)
            .ThenBy(x => x.SortOrder)
            .ToPagedAsync(request.Pagination, cancellationToken: cancellationToken);
    }
}