using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Employees.Queries;

public class GetEmployeeHandler
    (IEmployeeRepository employeeRepository,
     IUserRepository userRepository,
     IDepartmentRepository departmentRepository,
     IWorkShiftRepository workShiftRepository,
     IEmployeeMapperService mapper)
    : IRequestHandler<GetEmployeeRequest, OperationResult<GetEmployeeResponse?>>
{
    public async Task<OperationResult<GetEmployeeResponse?>> Handle(GetEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await employeeRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (employee is null)
            return (GetEmployeeResponse?)null;

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        Domain.Entities.User? managerUser = null;
        if (employee.ManagerId is not null)
        {
            var manager = await employeeRepository.GetAsNoTrackingAsync(employee.ManagerId.Value, cancellationToken);
            if (manager is not null)
                managerUser = await userRepository.GetAsNoTrackingAsync(manager.UserId, cancellationToken);
        }

        Domain.Entities.WorkShift? workShift = null;
        if (employee.WorkShiftId is not null)
            workShift = await workShiftRepository.GetAsNoTrackingAsync(employee.WorkShiftId.Value, cancellationToken);

        return mapper.Map(employee, user, department, managerUser, workShift);
    }
}
