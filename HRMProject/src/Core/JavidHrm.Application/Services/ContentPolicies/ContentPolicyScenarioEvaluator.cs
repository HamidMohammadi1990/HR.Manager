using System.Linq.Expressions;
using JavidHrm.Domain.ContentPolicies;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Models.ContentPolicies;

namespace JavidHrm.Application.Services.ContentPolicies;

public sealed class ContentPolicyScenarioEvaluator
    (
        ContentPolicyExpressionBuilder expressionBuilder,
        IContentEntityTypeRegistry entityTypeRegistry,
        IContentPolicyEntityPreviewQuery entityPreviewQuery,
        IContentPolicyMapperService mapper)
{
    public async Task<ContentPolicyScenarioPreviewDto> EvaluateAsync(
        int userId,
        string entityType,
        ContentPolicyResolutionResult resolution,
        CachedUserContentPolicyContext userContext,
        bool bypassContentPolicy,
        bool requireContentPolicy,
        int sampleSize,
        CancellationToken cancellationToken = default)
    {
        var filter = bypassContentPolicy
            ? null
            : CompileFilter(userId, entityType, resolution.AppliedPolicies, userContext, requireContentPolicy);

        var accessMode = ContentPolicyFilter.ResolveAccessMode(
            bypassContentPolicy,
            requireContentPolicy,
            filter,
            resolution.AppliedPolicies.Count);

        var previewData = await LoadPreviewDataAsync(
            entityType,
            filter,
            accessMode,
            sampleSize,
            cancellationToken);

        return new ContentPolicyScenarioPreviewDto(
            resolution.EffectiveMergeMode,
            accessMode,
            mapper.Map(resolution.AppliedPolicies),
            mapper.Map(resolution.ExcludedRolePolicies),
            previewData.TotalEntityCount,
            previewData.AccessibleEntityCount,
            previewData.SampleAccessibleIds);
    }

    private LambdaExpression? CompileFilter(
        int userId,
        string entityType,
        IReadOnlyList<ContentPolicyWithRulesDto> policies,
        CachedUserContentPolicyContext userContext,
        bool requireContentPolicy)
    {
        if (policies.Count == 0)
            return requireContentPolicy ? BuildDenyAll(entityType) : null;

        var policyContext = new ContentPolicyContext(
            userId,
            userContext.DepartmentIds,
            userContext.RoleIds);

        var filter = ContentPolicyExpressionBuildInvoker.Build(
            expressionBuilder,
            entityTypeRegistry,
            entityType,
            policies,
            policyContext);

        if (filter is null && requireContentPolicy)
            return BuildDenyAll(entityType);

        return filter;
    }

    private async Task<ContentPolicyEntityPreviewData> LoadPreviewDataAsync(
        string entityType,
        LambdaExpression? filter,
        ContentPolicyAccessMode accessMode,
        int sampleSize,
        CancellationToken cancellationToken)
    {
        if (accessMode == ContentPolicyAccessMode.DenyAll)
        {
            var totalOnly = await entityPreviewQuery.PreviewAsync(entityType, null, sampleSize, cancellationToken);
            return new ContentPolicyEntityPreviewData(totalOnly.TotalEntityCount, 0, []);
        }

        return await entityPreviewQuery.PreviewAsync(entityType, filter, sampleSize, cancellationToken);
    }

    private LambdaExpression BuildDenyAll(string entityType)
    {
        var entityClrType = entityTypeRegistry.GetClrType(entityType);
        var parameter = Expression.Parameter(entityClrType, "entity");
        return Expression.Lambda(Expression.Constant(false), parameter);
    }
}
