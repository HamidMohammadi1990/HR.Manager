using JavidHrm.Application.Features.PayrollEntries.Queries;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.PayrollEntries;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class PayrollEntryMapperService : IPayrollEntryMapperService
{
    public GetAllPayrollEntryRequestDto Map(GetAllPayrollEntryRequest model)
        => new()
        {
            EmployeeId = model.EmployeeId,
            DepartmentId = model.DepartmentId,
            UserId = model.UserId,
            Year = model.Year,
            Month = model.Month,
            Status = model.Status,
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeCode = model.EmployeeCode,
            Pagination = model.Pagination
        };

    public GetPayrollEntryResponse Map(PayrollEntry model, Employee employee, User user, Department department)
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
            Year = model.Year,
            Month = model.Month,
            BaseSalary = model.BaseSalary,
            GrossAmount = model.GrossAmount,
            Deductions = model.Deductions,
            NetAmount = model.NetAmount,
            Status = model.Status,
            Notes = model.Notes,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllPayrollEntryResponse> Map(PagedResult<GetAllPayrollEntryResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllPayrollEntryResponse
        {
            Id = x.Id,
            EmployeeId = x.EmployeeId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            EmployeeCode = x.EmployeeCode,
            Year = x.Year,
            Month = x.Month,
            BaseSalary = x.BaseSalary,
            GrossAmount = x.GrossAmount,
            Deductions = x.Deductions,
            NetAmount = x.NetAmount,
            Status = x.Status,
            Notes = x.Notes,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllPayrollEntryResponse>.Create(items, model);
    }
}
