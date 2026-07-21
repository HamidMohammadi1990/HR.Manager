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
            GraceMinutes = model.GraceMinutes,
            EarlyLeaveGraceMinutes = model.EarlyLeaveGraceMinutes,
            IsOvernight = model.IsOvernight,
            IsActive = model.IsActive,
            Description = model.Description,
            Color = model.Color
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
            GraceMinutes = x.GraceMinutes,
            EarlyLeaveGraceMinutes = x.EarlyLeaveGraceMinutes,
            IsOvernight = x.IsOvernight,
            IsActive = x.IsActive,
            Description = x.Description,
            Color = x.Color
        }).ToList();

        return PagedResult<GetAllWorkShiftResponse>.Create(items, model);
    }
}
