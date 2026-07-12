using JavidHrm.Application.Features.AttendanceRecords.Queries;
using JavidHrm.Domain.Dtos.AttendanceRecords;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IAttendanceRecordMapperService : IMapper
{
    GetAllAttendanceRecordRequestDto Map(GetAllAttendanceRecordRequest model);
    GetAttendanceRecordResponse Map(AttendanceRecord model, Employee employee, User user, Department department);
    PagedResult<GetAllAttendanceRecordResponse> Map(PagedResult<GetAllAttendanceRecordResponseDto> model);
}
