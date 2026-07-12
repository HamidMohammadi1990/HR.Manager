using JavidHrm.Application.Features.Employees.Queries;
using JavidHrm.Domain.Dtos.Employees;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class EmployeeMapperService : IEmployeeMapperService
{
    public GetAllEmployeeRequestDto Map(GetAllEmployeeRequest model)
        => new()
        {
            DepartmentId = model.DepartmentId,
            UserId = model.UserId,
            ManagerId = model.ManagerId,
            EmployeeCode = model.EmployeeCode,
            JobTitle = model.JobTitle,
            FirstName = model.FirstName,
            LastName = model.LastName,
            IsActive = model.IsActive,
            Pagination = model.Pagination
        };

    public GetEmployeeResponse Map(Employee model, User user, Department department, User? managerUser)
        => new()
        {
            Id = model.Id,
            UserId = model.UserId,
            UserFirstName = user.FirstName,
            UserLastName = user.LastName,
            UserName = user.UserName,
            DepartmentId = model.DepartmentId,
            DepartmentName = department.Name,
            ManagerId = model.ManagerId,
            ManagerFirstName = managerUser?.FirstName,
            ManagerLastName = managerUser?.LastName,
            EmployeeCode = model.EmployeeCode,
            JobTitle = model.JobTitle,
            HireDate = model.HireDate,
            IsActive = model.IsActive,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllEmployeeResponse> Map(PagedResult<GetAllEmployeeResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllEmployeeResponse
        {
            Id = x.Id,
            UserId = x.UserId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            ManagerId = x.ManagerId,
            ManagerFirstName = x.ManagerFirstName,
            ManagerLastName = x.ManagerLastName,
            EmployeeCode = x.EmployeeCode,
            JobTitle = x.JobTitle,
            HireDate = x.HireDate,
            IsActive = x.IsActive,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllEmployeeResponse>.Create(items, model);
    }
}
