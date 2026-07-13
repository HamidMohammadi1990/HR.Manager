using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyFilteredRequest
{
    Type EntityClrType { get; }

    /// <summary>Optional override for standard actions.</summary>
    ContentPolicyQueryAction? ContentPolicyQueryAction { get; }
}

public interface IContentPolicyFilteredRequest<TEntity> : IContentPolicyFilteredRequest
    where TEntity : class
{
    Type IContentPolicyFilteredRequest.EntityClrType => typeof(TEntity);

    ContentPolicyQueryAction? IContentPolicyFilteredRequest.ContentPolicyQueryAction => null;
}
