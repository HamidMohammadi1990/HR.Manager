using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyPropertyOperatorsHandler
    (IContentPolicyMetadataRepository metadataRepository, IContentPolicyMapperService mapper)
    : IRequestHandler<GetContentPolicyPropertyOperatorsRequest, OperationResult<GetContentPolicyPropertyOperatorsResponse>>
{
    public Task<OperationResult<GetContentPolicyPropertyOperatorsResponse>> Handle(
        GetContentPolicyPropertyOperatorsRequest request,
        CancellationToken cancellationToken)
    {
        var requestDto = mapper.Map(request);
        var operators = metadataRepository.GetAllowedOperators(requestDto);
        return Task.FromResult<OperationResult<GetContentPolicyPropertyOperatorsResponse>>(mapper.Map(requestDto, operators));
    }
}
