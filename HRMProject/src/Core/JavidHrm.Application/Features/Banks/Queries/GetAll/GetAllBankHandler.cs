using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Banks.Queries;

public class GetAllBankHandler
    (IBankRepository bankRepository, IBankMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllBankRequest, OperationResult<PagedResult<GetAllBankResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllBankResponse>>> Handle(GetAllBankRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Bank>();
        var banks = await bankRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(banks);
    }
}
