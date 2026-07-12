using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyPropertyOperatorsRequest : IRequest<OperationResult<GetContentPolicyPropertyOperatorsResponse>>
{
    public string EntityType { get; init; }
    public string FieldPath { get; init; } = default!;
}