using JavidHrm.Application.Features.LeaveBalances.Queries;
using JavidHrm.Domain.Dtos.LeaveBalances;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ILeaveBalanceMapperService : IMapper
{
    GetAllLeaveBalanceRequestDto Map(GetAllLeaveBalanceRequest model);
    GetLeaveBalanceResponse Map(
        LeaveBalance model,
        Employee employee,
        User user,
        Department department,
        LeaveTypeDefinition leaveTypeDefinition);
    PagedResult<GetAllLeaveBalanceResponse> Map(PagedResult<GetAllLeaveBalanceResponseDto> model);
}
