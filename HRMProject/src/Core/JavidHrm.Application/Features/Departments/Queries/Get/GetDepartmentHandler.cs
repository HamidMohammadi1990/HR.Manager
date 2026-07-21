using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Departments.Queries;

public class GetDepartmentHandler
    (IDepartmentRepository departmentRepository, IDepartmentMapperService mapper)
    : IRequestHandler<GetDepartmentRequest, OperationResult<GetDepartmentResponse?>>
{
    public async Task<OperationResult<GetDepartmentResponse?>> Handle(GetDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = await departmentRepository.GetDetailAsync(request.Id, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(department);
    }
}
