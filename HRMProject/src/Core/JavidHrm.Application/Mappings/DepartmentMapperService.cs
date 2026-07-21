using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Departments;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.Departments.Queries;

namespace JavidHrm.Application.Mappings;

public class DepartmentMapperService : IDepartmentMapperService
{
    public GetAllDepartmentRequestDto Map(GetAllDepartmentRequest model)
        => new()
        {
            Code = model.Code,
            Name = model.Name,
            UserId = model.UserId,
            ParentDepartmentId = model.ParentDepartmentId,
            IsActive = model.IsActive,
            Pagination = model.Pagination
        };

    public SearchDepartmentRequestDto Map(SearchDepartmentRequest model)
        => new()
        {
            Code = model.Code,
            Name = model.Name,
            UserId = model.UserId,
            ParentDepartmentId = model.ParentDepartmentId,
            Pagination = model.Pagination
        };

    public GetDepartmentResponse Map(Department model)
        => new()
        {
            Id = model.Id,
            Code = model.Code,
            Name = model.Name,
            ParentDepartmentId = model.ParentDepartmentId,
            ParentDepartmentName = model.ParentDepartment?.Name,
            DefaultWorkShiftId = model.DefaultWorkShiftId,
            DefaultWorkShiftName = model.DefaultWorkShift?.Name,
            IsActive = model.IsActive,
            Description = model.Description,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllDepartmentResponse> Map(PagedResult<GetAllDepartmentResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllDepartmentResponse
        {
            Id = x.Id,
            Code = x.Code,
            Name = x.Name,
            ParentDepartmentId = x.ParentDepartmentId,
            ParentDepartmentName = x.ParentDepartmentName,
            IsActive = x.IsActive,
            Description = x.Description,
            CreatedOnUtc = x.CreatedOnUtc,
        }).ToList();

        return PagedResult<GetAllDepartmentResponse>.Create(items, model);
    }

    public PagedResult<SearchDepartmentResponse> Map(PagedResult<SearchDepartmentResponseDto> model)
    {
        var items = model.Items.Select(x => new SearchDepartmentResponse
        {
            Id = x.Id,
            Code = x.Code,
            Name = x.Name,
            ParentDepartmentId = x.ParentDepartmentId,
            ParentDepartmentName = x.ParentDepartmentName,
            Description = x.Description,
            CreatedOnUtc = x.CreatedOnUtc,
        }).ToList();

        return PagedResult<SearchDepartmentResponse>.Create(items, model);
    }
}
