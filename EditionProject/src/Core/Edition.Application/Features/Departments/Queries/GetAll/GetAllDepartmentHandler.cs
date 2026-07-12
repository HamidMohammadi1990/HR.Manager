using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Departments.Queries;

public class GetAllDepartmentHandler
    (IDepartmentRepository departmentRepository, IDepartmentMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllDepartmentRequest, OperationResult<PagedResult<GetAllDepartmentResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllDepartmentResponse>>> Handle(GetAllDepartmentRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Department>();
        var departments = await departmentRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(departments);
    }
}
