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
    public Task<Department?> GetDetailAsync(int id, CancellationToken cancellationToken = default)
        => Context.Department
            .AsNoTracking()
            .Include(x => x.ParentDepartment)
            .Include(x => x.DefaultWorkShift)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task<PagedResult<GetAllDepartmentResponseDto>> GetAllAsync(
        GetAllDepartmentRequestDto request,
        Expression<Func<Department, bool>>? contentFilter = null)
    {
        var departmentSource = Context.Department.ApplyContentPolicyFilter(contentFilter);

        var departments =
            from department in departmentSource
            join parent in Context.Department on department.ParentDepartmentId equals parent.Id into parentJoin
            from parent in parentJoin.DefaultIfEmpty()
            select new { department, parent };

        departments = departments.ApplyQueryFilters(request);

        return await departments
            .Select(x => new GetAllDepartmentResponseDto
            {
                Id = x.department.Id,
                Name = x.department.Name,
                Code = x.department.Code,
                ParentDepartmentId = x.department.ParentDepartmentId,
                ParentDepartmentName = x.parent != null ? x.parent.Name : null,
                IsActive = x.department.IsActive,
                UserId = x.department.UserId,
                UserFirstName = null,
                UserLastName = null,
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
            join parent in Context.Department on department.ParentDepartmentId equals parent.Id into parentJoin
            from parent in parentJoin.DefaultIfEmpty()
            select new { department, parent };

        departments = departments.ApplyQueryFilters(request);

        return await departments
            .Select(x => new SearchDepartmentResponseDto
            {
                Id = x.department.Id,
                Name = x.department.Name,
                Code = x.department.Code,
                ParentDepartmentId = x.department.ParentDepartmentId,
                ParentDepartmentName = x.parent != null ? x.parent.Name : null,
                UserId = x.department.UserId,
                UserFirstName = null,
                UserLastName = null,
                Description = x.department.Description,
                CreatedOnUtc = x.department.CreatedOnUtc,
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
