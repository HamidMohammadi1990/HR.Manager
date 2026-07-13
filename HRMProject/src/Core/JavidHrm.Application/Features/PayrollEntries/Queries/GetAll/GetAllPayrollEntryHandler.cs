using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetAllPayrollEntryHandler
    (IPayrollEntryRepository payrollEntryRepository, IPayrollEntryMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllPayrollEntryRequest, OperationResult<PagedResult<GetAllPayrollEntryResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllPayrollEntryResponse>>> Handle(GetAllPayrollEntryRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.PayrollEntry>();
        var payrollEntries = await payrollEntryRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(payrollEntries);
    }
}
