using JavidHrm.Domain.Dtos.ContentPolicies;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyPropertyOperatorsResponse
{
    public string FieldPath { get; init; } = default!;
    public IReadOnlyList<ContentPolicyEnumOptionDto> Operators { get; init; } = [];
}
