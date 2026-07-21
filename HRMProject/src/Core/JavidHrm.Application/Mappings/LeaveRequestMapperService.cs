using JavidHrm.Application.Features.LeaveRequests.Queries;

using JavidHrm.Domain.Dtos.LeaveRequests;

using JavidHrm.Domain.Dtos.Pagination;

using JavidHrm.Domain.Entities;

using JavidHrm.Domain.Enums;

using JavidHrm.Application.Contracts.Mapping;



namespace JavidHrm.Application.Mappings;



public class LeaveRequestMapperService : ILeaveRequestMapperService

{

    public GetAllLeaveRequestRequestDto Map(GetAllLeaveRequestRequest model)

        => new()

        {

            EmployeeId = model.EmployeeId,

            DepartmentId = model.DepartmentId,

            UserId = model.UserId,

            LeaveTypeDefinitionId = model.LeaveTypeDefinitionId,

            Status = model.Status,

            FirstName = model.FirstName,

            LastName = model.LastName,

            EmployeeCode = model.EmployeeCode,

            Pagination = model.Pagination

        };



    public GetLeaveRequestResponse Map(

        LeaveRequest model,

        Employee employee,

        User user,

        Department department,

        LeaveTypeDefinition leaveTypeDefinition,

        IReadOnlyList<LeaveRequestApprovalStep> approvalSteps,

        bool canCurrentUserAct)

        => new()

        {

            Id = model.Id,

            EmployeeId = model.EmployeeId,

            UserFirstName = user.FirstName,

            UserLastName = user.LastName,

            UserName = user.UserName,

            DepartmentId = employee.DepartmentId,

            DepartmentName = department.Name,

            EmployeeCode = employee.EmployeeCode,

            LeaveTypeDefinitionId = model.LeaveTypeDefinitionId,

            LeaveTypeName = leaveTypeDefinition.Name,

            LeaveTypeUnit = leaveTypeDefinition.Unit,

            LeaveTypeCode = leaveTypeDefinition.Code,

            StartDate = model.StartDate,

            EndDate = model.EndDate,

            Status = model.Status,

            Reason = model.Reason,

            CreatedOnUtc = model.CreatedOnUtc,

            CurrentApprovalStepOrder = model.CurrentApprovalStepOrder,

            TotalApprovalSteps = model.TotalApprovalSteps,

            CanCurrentUserAct = canCurrentUserAct,

            ApprovalSteps = approvalSteps

                .OrderBy(x => x.StepOrder)

                .Select(step => new LeaveRequestApprovalStepResponse

                {

                    StepOrder = step.StepOrder,

                    ApproverEmployeeId = step.ApproverEmployeeId,

                    ApproverFirstName = step.ApproverEmployee?.User?.FirstName,

                    ApproverLastName = step.ApproverEmployee?.User?.LastName,

                    ApproverJobTitle = step.ApproverEmployee?.JobTitle,

                    IsHrPool = step.ApproverEmployeeId is null,

                    Status = step.Status,

                    Comment = step.Comment,

                    ActionedAtUtc = step.ActionedAtUtc,

                    IsCurrent = model.CurrentApprovalStepOrder == step.StepOrder

                               && step.Status == LeaveApprovalStepStatus.Pending

                })

                .ToList()

        };



    public PagedResult<GetAllLeaveRequestResponse> Map(PagedResult<GetAllLeaveRequestResponseDto> model)

    {

        var items = model.Items.Select(x => new GetAllLeaveRequestResponse

        {

            Id = x.Id,

            EmployeeId = x.EmployeeId,

            UserFirstName = x.UserFirstName,

            UserLastName = x.UserLastName,

            UserName = x.UserName,

            DepartmentId = x.DepartmentId,

            DepartmentName = x.DepartmentName,

            EmployeeCode = x.EmployeeCode,

            LeaveTypeDefinitionId = x.LeaveTypeDefinitionId,

            LeaveTypeName = x.LeaveTypeName,

            LeaveTypeUnit = x.LeaveTypeUnit,

            LeaveTypeCode = x.LeaveTypeCode,

            StartDate = x.StartDate,

            EndDate = x.EndDate,

            Status = x.Status,

            Reason = x.Reason,

            CreatedOnUtc = x.CreatedOnUtc,

            CurrentApprovalStepOrder = x.CurrentApprovalStepOrder,

            TotalApprovalSteps = x.TotalApprovalSteps

        }).ToList();



        return PagedResult<GetAllLeaveRequestResponse>.Create(items, model);

    }

}

