using System.Linq.Expressions;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Common.Extensions;

public static class ContentPolicyHandlerExtensions
{
    public static Expression<Func<TEntity, bool>>? GetContentFilter<TEntity>(this IContentPolicyFilterContext context)
        => context.GetFilter<TEntity>();
}