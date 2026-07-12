using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public class GetLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, ILeaveRequestMapperService mapper)
    : IRequestHandler<GetLeaveRequestRequest, OperationResult<GetLeaveRequestResponse?>>
{
    public async Task<OperationResult<GetLeaveRequestResponse?>> Handle(GetLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var leaveRequest = await leaveRequestRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (leaveRequest is null)
            return (GetLeaveRequestResponse?)null;

        var employee = await employeeRepository.GetAsNoTrackingAsync(leaveRequest.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        return mapper.Map(leaveRequest, employee, user, department);
    }
}
