using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Employees;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class EmployeeRepository(JavidHrmDbContext context)
    : Repository<Employee>(context), IEmployeeRepository
{
    public async Task<PagedResult<GetAllEmployeeResponseDto>> GetAllAsync(
        GetAllEmployeeRequestDto request,
        Expression<Func<Employee, bool>>? contentFilter = null)
    {
        var employeeSource = Context.Employee.ApplyContentPolicyFilter(contentFilter);

        var employees =
            from employee in employeeSource
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            join manager in Context.Employee on employee.ManagerId equals manager.Id into managers
            from manager in managers.DefaultIfEmpty()
            join managerUser in Context.User on manager.UserId equals managerUser.Id into managerUsers
            from managerUser in managerUsers.DefaultIfEmpty()
            select new { employee, user, department, managerUser };

        employees = employees.ApplyQueryFilters(request);

        return await employees
            .Select(x => new GetAllEmployeeResponseDto
            {
                Id = x.employee.Id,
                UserId = x.employee.UserId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                DepartmentId = x.employee.DepartmentId,
                DepartmentName = x.department.Name,
                ManagerId = x.employee.ManagerId,
                ManagerFirstName = x.managerUser != null ? x.managerUser.FirstName : null,
                ManagerLastName = x.managerUser != null ? x.managerUser.LastName : null,
                EmployeeCode = x.employee.EmployeeCode,
                JobTitle = x.employee.JobTitle,
                HireDate = x.employee.HireDate,
                IsActive = x.employee.IsActive,
                CreatedOnUtc = x.employee.CreatedOnUtc,
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
