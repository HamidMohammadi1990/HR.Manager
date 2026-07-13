using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Domain.Repositories;

public interface IContentPolicyRecordAccessRepository
{
    void Add(ContentPolicyRecordAccess recordAccess);
    void Remove(ContentPolicyRecordAccess recordAccess);
    void RemoveRange(IEnumerable<ContentPolicyRecordAccess> recordAccesses);
    ValueTask<ContentPolicyRecordAccess?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<ContentPolicyRecordAccess?> FindWithPolicyAsync(int id, CancellationToken cancellationToken = default);
    Task<List<ContentPolicyRecordAccess>> GetByPolicyIdAsync(int policyId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(int policyId, int entityId, CancellationToken cancellationToken = default);
    Task<PagedResult<ContentPolicyRecordAccess>> GetAllAsync(GetAllContentPolicyRecordAccessRequestDto request, CancellationToken cancellationToken = default);
}
