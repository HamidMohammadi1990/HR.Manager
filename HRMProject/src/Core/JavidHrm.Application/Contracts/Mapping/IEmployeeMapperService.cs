using JavidHrm.Application.Features.Employees.Queries;
using JavidHrm.Domain.Dtos.Employees;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IEmployeeMapperService : IMapper
{
    GetAllEmployeeRequestDto Map(GetAllEmployeeRequest model);
    GetEmployeeResponse Map(Employee model, User user, Department department, User? managerUser);
    PagedResult<GetAllEmployeeResponse> Map(PagedResult<GetAllEmployeeResponseDto> model);
}
