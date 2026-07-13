using JavidHrm.Application.Features.LeaveRequests.Queries;
using JavidHrm.Domain.Dtos.LeaveRequests;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
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
            LeaveType = model.LeaveType,
            Status = model.Status,
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeCode = model.EmployeeCode,
            Pagination = model.Pagination
        };

    public GetLeaveRequestResponse Map(LeaveRequest model, Employee employee, User user, Department department)
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
            LeaveType = model.LeaveType,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            Status = model.Status,
            Reason = model.Reason,
            CreatedOnUtc = model.CreatedOnUtc
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
            LeaveType = x.LeaveType,
            StartDate = x.StartDate,
            EndDate = x.EndDate,
            Status = x.Status,
            Reason = x.Reason,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllLeaveRequestResponse>.Create(items, model);
    }
}
