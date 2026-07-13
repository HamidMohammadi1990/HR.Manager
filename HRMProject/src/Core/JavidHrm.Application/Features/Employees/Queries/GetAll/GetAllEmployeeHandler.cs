using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Extensions;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.Employees.Queries;

public class GetAllEmployeeHandler
    (IEmployeeRepository employeeRepository, IEmployeeMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllEmployeeRequest, OperationResult<PagedResult<GetAllEmployeeResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllEmployeeResponse>>> Handle(GetAllEmployeeRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Employee>();
        var employees = await employeeRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(employees);
    }
}
