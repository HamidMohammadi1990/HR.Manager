using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public class GetAllChartOfAccountHandler
    (IChartOfAccountRepository chartOfAccountRepository, IChartOfAccountMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllChartOfAccountRequest, OperationResult<PagedResult<GetAllChartOfAccountResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllChartOfAccountResponse>>> Handle(GetAllChartOfAccountRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.ChartOfAccount>();
        var accounts = await chartOfAccountRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(accounts);
        return result;
    }
}