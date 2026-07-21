using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class LeaveRequestApprovalStepRepository(JavidHrmDbContext context)
    : Repository<LeaveRequestApprovalStep>(context), ILeaveRequestApprovalStepRepository
{
    public void AddRange(IEnumerable<LeaveRequestApprovalStep> steps)
        => Context.LeaveRequestApprovalStep.AddRange(steps);

    public void RemoveRange(IEnumerable<LeaveRequestApprovalStep> steps)
        => Context.LeaveRequestApprovalStep.RemoveRange(steps);

    public async Task<IReadOnlyList<LeaveRequestApprovalStep>> GetByLeaveRequestIdAsync(
        int leaveRequestId,
        CancellationToken cancellationToken = default)
    {
        var items = await Context.LeaveRequestApprovalStep
            .AsNoTracking()
            .Include(x => x.ApproverEmployee)
                .ThenInclude(x => x!.User)
            .Where(x => x.LeaveRequestId == leaveRequestId)
            .OrderBy(x => x.StepOrder)
            .ToListAsync(cancellationToken);

        return items;
    }

    public async Task<PagedResult<LeaveApprovalInboxItemDto>> GetInboxAsync(
        int? approverEmployeeId,
        bool includeHrPoolSteps,
        PagedRequest pagination,
        CancellationToken cancellationToken = default)
    {
        var inboxQuery =
            from step in Context.LeaveRequestApprovalStep
            join leaveRequest in Context.LeaveRequest on step.LeaveRequestId equals leaveRequest.Id
            join employee in Context.Employee on leaveRequest.EmployeeId equals employee.Id
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            join leaveTypeDefinition in Context.LeaveTypeDefinition on leaveRequest.LeaveTypeDefinitionId equals leaveTypeDefinition.Id
            where leaveRequest.Status == LeaveRequestStatus.Pending
                  && step.Status == LeaveApprovalStepStatus.Pending
                  && step.StepOrder == leaveRequest.CurrentApprovalStepOrder
                  && (
                      (approverEmployeeId != null && step.ApproverEmployeeId == approverEmployeeId)
                      || (includeHrPoolSteps && step.ApproverEmployeeId == null))
            orderby leaveRequest.CreatedOnUtc descending
            select new LeaveApprovalInboxItemDto
            {
                LeaveRequestId = leaveRequest.Id,
                StepOrder = step.StepOrder,
                EmployeeId = employee.Id,
                UserFirstName = user.FirstName,
                UserLastName = user.LastName,
                EmployeeCode = employee.EmployeeCode,
                DepartmentId = department.Id,
                DepartmentName = department.Name,
                LeaveTypeDefinitionId = leaveTypeDefinition.Id,
                LeaveTypeName = leaveTypeDefinition.Name,
                LeaveTypeUnit = leaveTypeDefinition.Unit,
                StartDate = leaveRequest.StartDate,
                EndDate = leaveRequest.EndDate,
                Reason = leaveRequest.Reason,
                CreatedOnUtc = leaveRequest.CreatedOnUtc,
                CurrentApprovalStepOrder = leaveRequest.CurrentApprovalStepOrder,
                TotalApprovalSteps = leaveRequest.TotalApprovalSteps,
                IsHrPoolStep = step.ApproverEmployeeId == null
            };

        return await inboxQuery.AsNoTracking().ToPagedAsync(pagination);
    }
}
