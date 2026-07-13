using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Departments;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.Departments.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IDepartmentMapperService : IMapper
{
    GetDepartmentResponse Map(Department model);
    GetAllDepartmentRequestDto Map(GetAllDepartmentRequest model);
    SearchDepartmentRequestDto Map(SearchDepartmentRequest model);
    PagedResult<GetAllDepartmentResponse> Map(PagedResult<GetAllDepartmentResponseDto> model);
    PagedResult<SearchDepartmentResponse> Map(PagedResult<SearchDepartmentResponseDto> model);
}
