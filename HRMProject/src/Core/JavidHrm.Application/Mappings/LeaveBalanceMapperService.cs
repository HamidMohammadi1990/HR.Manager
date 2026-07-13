using JavidHrm.Application.Features.LeaveBalances.Queries;
using JavidHrm.Domain.Dtos.LeaveBalances;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class LeaveBalanceMapperService : ILeaveBalanceMapperService
{
    public GetAllLeaveBalanceRequestDto Map(GetAllLeaveBalanceRequest model)
        => new()
        {
            EmployeeId = model.EmployeeId,
            DepartmentId = model.DepartmentId,
            LeaveType = model.LeaveType,
            Year = model.Year,
            Pagination = model.Pagination
        };

    public GetLeaveBalanceResponse Map(LeaveBalance model, Employee employee, User user, Department department)
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
            Year = model.Year,
            TotalDays = model.TotalDays,
            UsedDays = model.UsedDays,
            RemainingDays = model.TotalDays - model.UsedDays
        };

    public PagedResult<GetAllLeaveBalanceResponse> Map(PagedResult<GetAllLeaveBalanceResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllLeaveBalanceResponse
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
            Year = x.Year,
            TotalDays = x.TotalDays,
            UsedDays = x.UsedDays,
            RemainingDays = x.RemainingDays
        }).ToList();

        return PagedResult<GetAllLeaveBalanceResponse>.Create(items, model);
    }
}
