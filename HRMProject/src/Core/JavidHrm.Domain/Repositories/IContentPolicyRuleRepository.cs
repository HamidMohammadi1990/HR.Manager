using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Domain.Repositories;

public interface IContentPolicyRuleRepository
{
    void Add(ContentPolicyRule rule);
    void Remove(ContentPolicyRule rule);
    ValueTask<ContentPolicyRule?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<ContentPolicyRule?> FindWithPolicyAsync(int id, CancellationToken cancellationToken = default);
    Task<PagedResult<ContentPolicyRule>> GetAllAsync(GetAllContentPolicyRuleRequestDto request, CancellationToken cancellationToken = default);
}