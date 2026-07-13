using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Departments;
using Microsoft.EntityFrameworkCore;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Infrastructure.Persistence.Extensions;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class DepartmentRepository(JavidHrmDbContext context)
    : Repository<Department>(context), IDepartmentRepository
{
    public async Task<PagedResult<GetAllDepartmentResponseDto>> GetAllAsync(
        GetAllDepartmentRequestDto request,
        Expression<Func<Department, bool>>? contentFilter = null)
    {
        var departmentSource = Context.Department.ApplyContentPolicyFilter(contentFilter);

        var departments =
            from department in departmentSource
            join user in Context.User on department.UserId equals user.Id
            join city in Context.City on department.CityId equals city.Id
            join province in Context.Province on city.ProvinceId equals province.Id
            select new { department, province, city, user };

        departments = departments.ApplyQueryFilters(request);

        return await departments
            .Select(x => new GetAllDepartmentResponseDto
            {
                Id = x.department.Id,
                Name = x.department.Name,
                Code = x.department.Code,
                CityId = x.department.CityId,
                CityName = x.city.Name,
                IsActive = x.department.IsActive,
                Address = x.department.Address,
                Email = x.department.Email,
                Latitude = x.department.Latitude,
                Longitude = x.department.Longitude,
                PhoneNumber = x.department.PhoneNumber,
                PostalCode = x.department.PostalCode,
                ProvinceId = x.province.Id,
                ProvinceName = x.province.Name,
                UserId = x.department.UserId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                Description = x.department.Description,
                CreatedOnUtc = x.department.CreatedOnUtc,
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public async Task<PagedResult<SearchDepartmentResponseDto>> SearchAsync(
        SearchDepartmentRequestDto request,
        Expression<Func<Department, bool>>? contentFilter = null)
    {
        var departmentSource = Context.Department
            .ApplyContentPolicyFilter(contentFilter)
            .Where(d => d.IsActive);

        var departments =
            from department in departmentSource
            join user in Context.User on department.UserId equals user.Id
            join city in Context.City on department.CityId equals city.Id
            join province in Context.Province on city.ProvinceId equals province.Id
            select new { department, province, city, user };

        departments = departments.ApplyQueryFilters(request);

        return await departments
            .Select(x => new SearchDepartmentResponseDto
            {
                Id = x.department.Id,
                Name = x.department.Name,
                Code = x.department.Code,
                CityId = x.department.CityId,
                CityName = x.city.Name,
                Address = x.department.Address,
                Email = x.department.Email,
                Latitude = x.department.Latitude,
                Longitude = x.department.Longitude,
                PhoneNumber = x.department.PhoneNumber,
                PostalCode = x.department.PostalCode,
                ProvinceId = x.province.Id,
                ProvinceName = x.province.Name,
                UserId = x.department.UserId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                Description = x.department.Description,
                CreatedOnUtc = x.department.CreatedOnUtc,
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
