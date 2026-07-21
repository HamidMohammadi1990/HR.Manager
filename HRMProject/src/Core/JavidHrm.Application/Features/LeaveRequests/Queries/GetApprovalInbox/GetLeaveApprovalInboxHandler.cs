using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public class GetLeaveApprovalInboxHandler
    (ILeaveRequestApprovalStepRepository approvalStepRepository,
     IEmployeeRepository employeeRepository,
     IAccountingService accountingService,
     ICurrentUserContext currentUserContext)
    : IRequestHandler<GetLeaveApprovalInboxRequest, OperationResult<PagedResult<GetLeaveApprovalInboxResponse>>>
{
    public async Task<OperationResult<PagedResult<GetLeaveApprovalInboxResponse>>> Handle(
        GetLeaveApprovalInboxRequest request,
        CancellationToken cancellationToken)
    {
        var employee = await employeeRepository.GetByUserIdAsync(currentUserContext.UserId, cancellationToken);
        var includeHrPoolSteps = await accountingService.HasPermissionAsync(
            currentUserContext.UserId,
            PermissionType.ApproveLeave);

        if (employee is null && !includeHrPoolSteps)
            return PagedResult<GetLeaveApprovalInboxResponse>.Create([], request.Pagination, 0);

        var inbox = await approvalStepRepository.GetInboxAsync(
            employee?.Id,
            includeHrPoolSteps,
            request.Pagination,
            cancellationToken);

        var items = inbox.Items.Select(x => new GetLeaveApprovalInboxResponse
        {
            LeaveRequestId = x.LeaveRequestId,
            StepOrder = x.StepOrder,
            EmployeeId = x.EmployeeId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            EmployeeCode = x.EmployeeCode,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            LeaveTypeDefinitionId = x.LeaveTypeDefinitionId,
            LeaveTypeName = x.LeaveTypeName,
            LeaveTypeUnit = x.LeaveTypeUnit,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            Reason = x.Reason,
            CreatedOnUtc = x.CreatedOnUtc,
            CurrentApprovalStepOrder = x.CurrentApprovalStepOrder,
            TotalApprovalSteps = x.TotalApprovalSteps,
            IsHrPoolStep = x.IsHrPoolStep
        }).ToList();

        return PagedResult<GetLeaveApprovalInboxResponse>.Create(items, inbox);
    }
}
