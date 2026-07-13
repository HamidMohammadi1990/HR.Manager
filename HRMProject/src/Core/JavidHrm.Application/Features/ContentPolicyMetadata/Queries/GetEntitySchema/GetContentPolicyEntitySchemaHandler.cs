using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ContentPolicyMetadata.Queries;

public class GetContentPolicyEntitySchemaHandler
    (IContentPolicyMetadataRepository metadataRepository, IContentPolicyMapperService mapper)
    : IRequestHandler<GetContentPolicyEntitySchemaRequest, OperationResult<GetContentPolicyEntitySchemaResponse>>
{
    public Task<OperationResult<GetContentPolicyEntitySchemaResponse>> Handle(
        GetContentPolicyEntitySchemaRequest request,
        CancellationToken cancellationToken)
    {
        var requestDto = mapper.Map(request);
        var properties = metadataRepository.GetEntitySchema(requestDto);
        return Task.FromResult<OperationResult<GetContentPolicyEntitySchemaResponse>>(mapper.Map(request, properties));
    }
}