using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetPayrollEntryHandler
    (IPayrollEntryRepository payrollEntryRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, IPayrollEntryMapperService mapper)
    : IRequestHandler<GetPayrollEntryRequest, OperationResult<GetPayrollEntryResponse?>>
{
    public async Task<OperationResult<GetPayrollEntryResponse?>> Handle(GetPayrollEntryRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = await payrollEntryRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (payrollEntry is null)
            return (GetPayrollEntryResponse?)null;

        var employee = await employeeRepository.GetAsNoTrackingAsync(payrollEntry.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(payrollEntry, employee, user, department);
    }
}
