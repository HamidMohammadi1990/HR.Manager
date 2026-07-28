using JavidHrm.Application.Contracts;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using MediatR;

namespace JavidHrm.Application.Features.Employees.Queries;

public class GetCurrentEmployeeHandler(
    IEmployeeRepository employeeRepository,
    IUserRepository userRepository,
    ICurrentUserContext currentUser)
    : IRequestHandler<GetCurrentEmployeeRequest, OperationResult<GetCurrentEmployeeResponse?>>
{
    public async Task<OperationResult<GetCurrentEmployeeResponse?>> Handle(
        GetCurrentEmployeeRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId;
        if (userId <= 0)
            return ErrorModel.Create("AccessDenied");

        var employee = await employeeRepository.GetByUserIdAsync(userId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("EmployeeNotFound");

        var user = await userRepository.GetAsNoTrackingAsync(userId, cancellationToken);

        return new GetCurrentEmployeeResponse
        {
            Id = employee.Id,
            EmployeeCode = employee.EmployeeCode,
            UserFirstName = user?.FirstName,
            UserLastName = user?.LastName,
        };
    }
}
