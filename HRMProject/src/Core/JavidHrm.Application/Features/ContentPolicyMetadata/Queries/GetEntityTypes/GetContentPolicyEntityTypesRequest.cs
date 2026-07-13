using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyEntityTypesRequest : IRequest<OperationResult<GetContentPolicyEntityTypesResponse>>;
