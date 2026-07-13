using System.Linq.Expressions;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyEntityAccessQuery
{
    Task<bool> ExistsAsync(
        string entityType,
        int resourceId,
        LambdaExpression? filter,
        CancellationToken cancellationToken = default);
}
