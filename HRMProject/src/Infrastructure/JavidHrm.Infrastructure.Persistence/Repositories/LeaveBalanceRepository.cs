using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveBalances;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class LeaveBalanceRepository(JavidHrmDbContext context)
    : Repository<LeaveBalance>(context), ILeaveBalanceRepository
{
    public Task<LeaveBalance?> FindByEmployeeAndTypeAndYearAsync(
        int employeeId,
        int leaveTypeDefinitionId,
        int year,
        CancellationToken cancellationToken = default)
        => Context.LeaveBalance.FirstOrDefaultAsync(
            x =>
                x.EmployeeId == employeeId &&
                x.LeaveTypeDefinitionId == leaveTypeDefinitionId &&
                x.Year == year,
            cancellationToken);

    public async Task<PagedResult<GetAllLeaveBalanceResponseDto>> GetAllAsync(
        GetAllLeaveBalanceRequestDto request,
        Expression<Func<LeaveBalance, bool>>? contentFilter = null)
    {
        var requestSource = Context.LeaveBalance.ApplyContentPolicyFilter(contentFilter);

        var leaveBalances =
            from leaveBalance in requestSource
            join employee in Context.Employee on leaveBalance.EmployeeId equals employee.Id
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            join leaveTypeDefinition in Context.LeaveTypeDefinition on leaveBalance.LeaveTypeDefinitionId equals leaveTypeDefinition.Id
            select new { leaveBalance, employee, user, department, leaveTypeDefinition };

        leaveBalances = leaveBalances.ApplyQueryFilters(request);

        return await leaveBalances
            .OrderByDescending(x => x.leaveBalance.Year)
            .ThenBy(x => x.employee.EmployeeCode)
            .Select(x => new GetAllLeaveBalanceResponseDto
            {
                Id = x.leaveBalance.Id,
                EmployeeId = x.leaveBalance.EmployeeId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                DepartmentId = x.employee.DepartmentId,
                DepartmentName = x.department.Name,
                EmployeeCode = x.employee.EmployeeCode,
                LeaveTypeDefinitionId = x.leaveBalance.LeaveTypeDefinitionId,
                LeaveTypeName = x.leaveTypeDefinition.Name,
                LeaveTypeCode = x.leaveTypeDefinition.Code,
                Year = x.leaveBalance.Year,
                TotalDays = x.leaveBalance.TotalDays,
                UsedDays = x.leaveBalance.UsedDays,
                RemainingDays = x.leaveBalance.TotalDays - x.leaveBalance.UsedDays
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public Task<bool> ExistsAsync(
        int employeeId,
        int leaveTypeDefinitionId,
        int year,
        int? excludeId = null,
        CancellationToken cancellationToken = default)
        => Context.LeaveBalance.AnyAsync(
            lb =>
                lb.EmployeeId == employeeId &&
                lb.LeaveTypeDefinitionId == leaveTypeDefinitionId &&
                lb.Year == year &&
                (excludeId == null || lb.Id != excludeId),
            cancellationToken);
}
