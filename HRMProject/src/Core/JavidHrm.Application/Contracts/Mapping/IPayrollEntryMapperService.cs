using JavidHrm.Application.Features.PayrollEntries.Queries;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.PayrollEntries;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IPayrollEntryMapperService : IMapper
{
    GetAllPayrollEntryRequestDto Map(GetAllPayrollEntryRequest model);
    GetPayrollEntryResponse Map(PayrollEntry model, Employee employee, User user, Department department);
    PagedResult<GetAllPayrollEntryResponse> Map(PagedResult<GetAllPayrollEntryResponseDto> model);
}
