using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class LeaveRequestRepository(JavidHrmDbContext context)
    : Repository<LeaveRequest>(context), ILeaveRequestRepository
{
    public async Task<PagedResult<GetAllLeaveRequestResponseDto>> GetAllAsync(
        GetAllLeaveRequestRequestDto request,
        Expression<Func<LeaveRequest, bool>>? contentFilter = null)
    {
        var requestSource = Context.LeaveRequest.ApplyContentPolicyFilter(contentFilter);

        var leaveRequests =
            from leaveRequest in requestSource
            join employee in Context.Employee on leaveRequest.EmployeeId equals employee.Id
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            select new { request = leaveRequest, employee, user, department };

        leaveRequests = leaveRequests.ApplyQueryFilters(request);

        return await leaveRequests
            .Select(x => new GetAllLeaveRequestResponseDto
            {
                Id = x.request.Id,
                EmployeeId = x.request.EmployeeId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                DepartmentId = x.employee.DepartmentId,
                DepartmentName = x.department.Name,
                EmployeeCode = x.employee.EmployeeCode,
                LeaveType = x.request.LeaveType,
                StartDate = x.request.StartDate,
                EndDate = x.request.EndDate,
                Status = x.request.Status,
                Reason = x.request.Reason,
                CreatedOnUtc = x.request.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
