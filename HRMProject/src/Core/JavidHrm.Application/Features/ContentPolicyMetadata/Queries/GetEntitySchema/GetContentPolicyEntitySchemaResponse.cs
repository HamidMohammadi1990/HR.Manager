using JavidHrm.Domain.Dtos.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyEntitySchemaResponse
{
    public string EntityType { get; init; }
    public string? ParentPath { get; init; }
    public IReadOnlyList<ContentPolicySchemaPropertyDto> Properties { get; init; } = [];
}
