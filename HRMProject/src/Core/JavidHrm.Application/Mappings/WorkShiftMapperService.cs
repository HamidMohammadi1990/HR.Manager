using JavidHrm.Application.Features.WorkShifts.Queries;
using JavidHrm.Domain.Dtos.WorkShifts;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class WorkShiftMapperService : IWorkShiftMapperService
{
    public GetAllWorkShiftRequestDto Map(GetAllWorkShiftRequest model)
        => new()
        {
            Name = model.Name,
            IsActive = model.IsActive,
            Pagination = model.Pagination
        };

    public GetWorkShiftResponse Map(WorkShift model)
        => new()
        {
            Id = model.Id,
            Name = model.Name,
            StartTime = model.StartTime,
            EndTime = model.EndTime,
            BreakMinutes = model.BreakMinutes,
            IsActive = model.IsActive,
            Description = model.Description
        };

    public PagedResult<GetAllWorkShiftResponse> Map(PagedResult<GetAllWorkShiftResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllWorkShiftResponse
        {
            Id = x.Id,
            Name = x.Name,
            StartTime = x.StartTime,
            EndTime = x.EndTime,
            BreakMinutes = x.BreakMinutes,
            IsActive = x.IsActive,
            Description = x.Description
        }).ToList();

        return PagedResult<GetAllWorkShiftResponse>.Create(items, model);
    }
}
