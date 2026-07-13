using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public record GetContentPolicyRuleOptionsRequest : IRequest<OperationResult<GetContentPolicyRuleOptionsResponse>>;
