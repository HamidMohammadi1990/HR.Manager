using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetLeaveBalanceHandler
    (ILeaveBalanceRepository leaveBalanceRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, ILeaveBalanceMapperService mapper)
    : IRequestHandler<GetLeaveBalanceRequest, OperationResult<GetLeaveBalanceResponse?>>
{
    public async Task<OperationResult<GetLeaveBalanceResponse?>> Handle(GetLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var leaveBalance = await leaveBalanceRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (leaveBalance is null)
            return (GetLeaveBalanceResponse?)null;

        var employee = await employeeRepository.GetAsNoTrackingAsync(leaveBalance.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(leaveBalance, employee, user, department);
    }
}
