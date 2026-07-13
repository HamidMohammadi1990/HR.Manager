using System.Linq.Expressions;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Enums;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Services.ContentPolicies;

public sealed class ContentPolicyFilterContext
    (IContentEntityTypeRegistry entityTypeRegistry)
    : IContentPolicyFilterContext
{
    private LambdaExpression? _filter;

    public bool IsResolved { get; private set; }
    public string? EntityType { get; private set; }
    public ContentPolicyQueryAction? QueryAction { get; private set; }
    public bool DenyAll { get; private set; }

    public Expression<Func<TEntity, bool>>? GetFilter<TEntity>()
    {
        if (DenyAll)
            return _ => false;

        if (EntityType is { } entityType
            && typeof(TEntity) != entityTypeRegistry.GetClrType(entityType))
            return null;

        return _filter as Expression<Func<TEntity, bool>>;
    }

    public void SetResolved(string entityType, ContentPolicyQueryAction queryAction, object? filter, bool denyAll = false)
    {
        EntityType = entityType;
        QueryAction = queryAction;
        _filter = filter as LambdaExpression;
        DenyAll = denyAll;
        IsResolved = true;
    }
}
