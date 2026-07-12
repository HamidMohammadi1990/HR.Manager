using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.PayrollEntries;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class PayrollEntryRepository(JavidHrmDbContext context)
    : Repository<PayrollEntry>(context), IPayrollEntryRepository
{
    public async Task<PagedResult<GetAllPayrollEntryResponseDto>> GetAllAsync(
        GetAllPayrollEntryRequestDto request,
        Expression<Func<PayrollEntry, bool>>? contentFilter = null)
    {
        var entrySource = Context.PayrollEntry.ApplyContentPolicyFilter(contentFilter);

        var payrollEntries =
            from entry in entrySource
            join employee in Context.Employee on entry.EmployeeId equals employee.Id
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            select new { entry, employee, user, department };

        payrollEntries = payrollEntries.ApplyQueryFilters(request);

        return await payrollEntries
            .Select(x => new GetAllPayrollEntryResponseDto
            {
                Id = x.entry.Id,
                EmployeeId = x.entry.EmployeeId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                DepartmentId = x.employee.DepartmentId,
                DepartmentName = x.department.Name,
                EmployeeCode = x.employee.EmployeeCode,
                Year = x.entry.Year,
                Month = x.entry.Month,
                BaseSalary = x.entry.BaseSalary,
                GrossAmount = x.entry.GrossAmount,
                Deductions = x.entry.Deductions,
                NetAmount = x.entry.NetAmount,
                Status = x.entry.Status,
                Notes = x.entry.Notes,
                CreatedOnUtc = x.entry.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
