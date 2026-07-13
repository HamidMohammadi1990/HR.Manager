using JavidHrm.Application.Features.LeaveRequests.Queries;
using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ILeaveRequestMapperService : IMapper
{
    GetAllLeaveRequestRequestDto Map(GetAllLeaveRequestRequest model);
    GetLeaveRequestResponse Map(LeaveRequest model, Employee employee, User user, Department department);
    PagedResult<GetAllLeaveRequestResponse> Map(PagedResult<GetAllLeaveRequestResponseDto> model);
}
