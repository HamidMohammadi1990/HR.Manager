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
            CityId = model.CityId,
            IsActive = model.IsActive,
            PostalCode = model.PostalCode,
            ProvinceId = model.ProvinceId,
            Pagination = model.Pagination
        };

    public SearchDepartmentRequestDto Map(SearchDepartmentRequest model)
        => new()
        {
            Code = model.Code,
            Name = model.Name,
            UserId = model.UserId,
            CityId = model.CityId,
            PostalCode = model.PostalCode,
            ProvinceId = model.ProvinceId,
            Pagination = model.Pagination
        };

    public GetDepartmentResponse Map(Department model)
        => new()
        {
            Id = model.Id,
            Code = model.Code,
            Name = model.Name,
            Email = model.Email,
            UserId = model.UserId,
            CityId = model.CityId,
            Address = model.Address,
            IsActive = model.IsActive,
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            PostalCode = model.PostalCode,
            PhoneNumber = model.PhoneNumber,
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
            Email = x.Email,
            CityId = x.CityId,
            UserId = x.UserId,
            Address = x.Address,
            CityName = x.CityName,
            IsActive = x.IsActive,
            Latitude = x.Latitude,
            Longitude = x.Longitude,
            ProvinceId = x.ProvinceId,
            PostalCode = x.PostalCode,
            PhoneNumber = x.PhoneNumber,
            Description = x.Description,
            ProvinceName = x.ProvinceName,
            CreatedOnUtc = x.CreatedOnUtc,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
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
            Email = x.Email,
            CityId = x.CityId,
            UserId = x.UserId,
            Address = x.Address,
            CityName = x.CityName,
            Latitude = x.Latitude,
            Longitude = x.Longitude,
            ProvinceId = x.ProvinceId,
            PostalCode = x.PostalCode,
            PhoneNumber = x.PhoneNumber,
            Description = x.Description,
            ProvinceName = x.ProvinceName,
            CreatedOnUtc = x.CreatedOnUtc,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
        }).ToList();

        return PagedResult<SearchDepartmentResponse>.Create(items, model);
    }
}
