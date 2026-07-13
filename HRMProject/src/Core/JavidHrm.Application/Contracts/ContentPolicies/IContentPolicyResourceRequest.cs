namespace JavidHrm.Application.Contracts.ContentPolicies;

public interface IContentPolicyResourceRequest
{
    string EntityTypeName { get; }
    int ResourceId { get; }
}