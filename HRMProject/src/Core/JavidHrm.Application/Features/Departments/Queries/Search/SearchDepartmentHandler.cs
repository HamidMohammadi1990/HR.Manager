using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Common.Extensions;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Departments.Queries;

public class SearchDepartmentHandler
    (IDepartmentRepository departmentRepository, IDepartmentMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<SearchDepartmentRequest, OperationResult<PagedResult<SearchDepartmentResponse>>>
{
    public async Task<OperationResult<PagedResult<SearchDepartmentResponse>>> Handle(SearchDepartmentRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Department>();
        var departments = await departmentRepository.SearchAsync(requestModel, filter);
        return mapper.Map(departments);
    }
}