using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyFilter
{
    Task<LambdaExpression?> BuildFilterAsync(
        string entityType,
        ContentPolicyQueryAction queryAction,
        CancellationToken cancellationToken = default);

    Task<LambdaExpression?> BuildFilterForUserAsync(
        int userId,
        string entityType,
        ContentPolicyQueryAction queryAction,
        CancellationToken cancellationToken = default);
}

public interface IContentPolicyEntityPreviewQuery
{
    Task<ContentPolicyEntityPreviewData> PreviewAsync(
        string entityType,
        LambdaExpression? filter,
        int sampleSize,
        CancellationToken cancellationToken = default);
}
