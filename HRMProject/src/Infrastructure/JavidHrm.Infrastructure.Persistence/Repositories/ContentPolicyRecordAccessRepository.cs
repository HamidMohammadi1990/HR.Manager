using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class ContentPolicyRecordAccessRepository
    (JavidHrmDbContext context)
    : Repository<ContentPolicyRecordAccess>(context), IContentPolicyRecordAccessRepository
{
    public void RemoveRange(IEnumerable<ContentPolicyRecordAccess> recordAccesses)
        => Context.ContentPolicyRecordAccess.RemoveRange(recordAccesses);

    public async Task<ContentPolicyRecordAccess?> FindWithPolicyAsync(int id, CancellationToken cancellationToken = default)
        => await Context.ContentPolicyRecordAccess
            .Include(x => x.Policy)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<List<ContentPolicyRecordAccess>> GetByPolicyIdAsync(int policyId, CancellationToken cancellationToken = default)
        => Context.ContentPolicyRecordAccess
            .Where(x => x.PolicyId == policyId)
            .OrderBy(x => x.EntityId)
            .ToListAsync(cancellationToken);

    public Task<bool> ExistsAsync(int policyId, int entityId, CancellationToken cancellationToken = default)
        => Context.ContentPolicyRecordAccess
            .AnyAsync(x => x.PolicyId == policyId && x.EntityId == entityId, cancellationToken);

    public async Task<PagedResult<ContentPolicyRecordAccess>> GetAllAsync(
        GetAllContentPolicyRecordAccessRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var query = Context.ContentPolicyRecordAccess
            .Include(x => x.Policy)
            .AsNoTracking()
            .AsQueryable()
            .ApplyQueryFilters(request);

        return await query
            .OrderBy(x => x.PolicyId)
            .ThenBy(x => x.EntityId)
            .ToPagedAsync(request.Pagination, cancellationToken: cancellationToken);
    }
}