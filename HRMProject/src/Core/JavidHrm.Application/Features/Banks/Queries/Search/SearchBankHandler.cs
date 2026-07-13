using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Banks.Queries;

public class SearchBankHandler
    (IBankRepository bankRepository, IBankMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<SearchBankRequest, OperationResult<PagedResult<SearchBankResponse>>>
{
    public async Task<OperationResult<PagedResult<SearchBankResponse>>> Handle(SearchBankRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Bank>();
        var banks = await bankRepository.SearchAsync(requestModel, filter);
        return mapper.MapToSearch(banks);
    }
}
