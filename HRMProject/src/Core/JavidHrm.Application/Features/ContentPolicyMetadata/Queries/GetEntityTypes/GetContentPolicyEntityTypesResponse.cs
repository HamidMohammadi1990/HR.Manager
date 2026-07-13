using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyEntityTypesResponse
{
    public IReadOnlyList<ContentPolicyEntityTypeOptionDto> EntityTypes { get; init; } = [];
}
