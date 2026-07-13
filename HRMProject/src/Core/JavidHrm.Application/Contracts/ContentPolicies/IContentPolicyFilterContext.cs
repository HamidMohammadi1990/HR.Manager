using System.Linq.Expressions;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyFilterContext
{
    bool IsResolved { get; }
    string? EntityType { get; }
    ContentPolicyQueryAction? QueryAction { get; }
    bool DenyAll { get; }

    Expression<Func<TEntity, bool>>? GetFilter<TEntity>();
    void SetResolved(string entityType, ContentPolicyQueryAction queryAction, object? filter, bool denyAll = false);
}
