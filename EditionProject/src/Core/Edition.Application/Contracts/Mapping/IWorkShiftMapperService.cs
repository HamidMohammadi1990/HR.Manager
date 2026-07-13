using JavidHrm.Application.Features.WorkShifts.Queries;
using JavidHrm.Domain.Dtos.WorkShifts;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IWorkShiftMapperService : IMapper
{
    GetAllWorkShiftRequestDto Map(GetAllWorkShiftRequest model);
    GetWorkShiftResponse Map(WorkShift model);
    PagedResult<GetAllWorkShiftResponse> Map(PagedResult<GetAllWorkShiftResponseDto> model);
}
