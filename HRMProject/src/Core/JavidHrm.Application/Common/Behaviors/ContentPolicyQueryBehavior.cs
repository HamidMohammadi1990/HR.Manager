using System.Linq.Expressions;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Application.Services.ContentPolicies;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Common.Behaviors;

public sealed class ContentPolicyQueryBehavior<TRequest, TResponse>
    (IContentPolicyFilter contentPolicyFilter, IContentPolicyFilterContext contentPolicyFilterContext)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken = default)
    {
        if (request is IContentPolicyFilteredRequest filteredRequest
            && !contentPolicyFilterContext.IsResolved)
        {
            var entityType = filteredRequest.EntityClrType.Name;
            var queryAction = filteredRequest.ContentPolicyQueryAction
                ?? ContentPolicyQueryActionResolver.Resolve(request);

            var filter = await contentPolicyFilter.BuildFilterAsync(
                entityType,
                queryAction,
                cancellationToken);

            contentPolicyFilterContext.SetResolved(
                entityType,
                queryAction,
                filter,
                denyAll: filter is not null && IsDenyAll(filter));
        }

        return await next();
    }

    private static bool IsDenyAll(LambdaExpression filter)
        => filter.Body is ConstantExpression { Value: false };
}
