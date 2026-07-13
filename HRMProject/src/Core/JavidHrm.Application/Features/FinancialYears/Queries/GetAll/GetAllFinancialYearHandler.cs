using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public class GetAllFinancialYearHandler
    (IFinancialYearRepository financialYearRepository, IFinancialYearMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllFinancialYearRequest, OperationResult<PagedResult<GetAllFinancialYearResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllFinancialYearResponse>>> Handle(GetAllFinancialYearRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.FinancialYear>();
        var financialYears = await financialYearRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(financialYears);
        return result;
    }
}