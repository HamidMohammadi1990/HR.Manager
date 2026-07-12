using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyRuleOptionsHandler
    (IContentPolicyMetadataRepository metadataRepository, IContentPolicyMapperService mapper)
    : IRequestHandler<GetContentPolicyRuleOptionsRequest, OperationResult<GetContentPolicyRuleOptionsResponse>>
{
    public Task<OperationResult<GetContentPolicyRuleOptionsResponse>> Handle(
        GetContentPolicyRuleOptionsRequest request,
        CancellationToken cancellationToken)
        => Task.FromResult<OperationResult<GetContentPolicyRuleOptionsResponse>>(
            new GetContentPolicyRuleOptionsResponse
            {
                Operators = mapper.MapEnumOptions<ContentPolicyOperator>(),
                Effects = mapper.MapEnumOptions<ContentPolicyEffect>(),
                ValueTypes = mapper.MapEnumOptions<ContentPolicyValueType>(),
                QueryActions = mapper.MapEnumOptions<ContentPolicyQueryAction>(),
                RuleGroups = mapper.MapEnumOptions<ContentPolicyRuleGroup>(),
                MergeModes = mapper.MapEnumOptions<ContentPolicyMergeMode>(),
                ContextPaths = metadataRepository.GetContextPaths()
            });
}
