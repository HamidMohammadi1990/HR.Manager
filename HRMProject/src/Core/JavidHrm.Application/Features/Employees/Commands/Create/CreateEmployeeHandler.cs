using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Employees.Commands;

public class CreateEmployeeHandler
    (IUnitOfWork uow, IEmployeeRepository employeeRepository)
    : IRequestHandler<CreateEmployeeRequest, OperationResult<CreateEmployeeResponse>>
{
    public async Task<OperationResult<CreateEmployeeResponse>> Handle(CreateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = Domain.Entities.Employee.Create(
            request.UserId,
            request.DepartmentId,
            request.ManagerId,
            request.EmployeeCode.Trim(),
            request.JobTitle.Trim(),
            request.HireDate);

        if (request.IsActive)
            employee.Active();
        else
            employee.InActive();

        employeeRepository.Add(employee);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateEmployeeResponse>();

        return new CreateEmployeeResponse { Id = employee.Id };
    }
}
