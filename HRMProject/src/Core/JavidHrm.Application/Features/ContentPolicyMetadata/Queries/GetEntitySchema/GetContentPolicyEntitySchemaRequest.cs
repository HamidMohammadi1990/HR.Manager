using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyEntitySchemaRequest : IRequest<OperationResult<GetContentPolicyEntitySchemaResponse>>
{
    public string EntityType { get; init; }
    public string? ParentPath { get; init; }
}