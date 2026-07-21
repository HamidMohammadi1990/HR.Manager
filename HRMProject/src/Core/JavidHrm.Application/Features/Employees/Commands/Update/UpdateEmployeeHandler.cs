using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Employees.Commands;

public class UpdateEmployeeHandler
    (IEmployeeRepository employeeRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateEmployeeRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await employeeRepository.FindAsync(request.Id, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        if (request.ManagerId == request.Id)
            return ErrorModel.Create("InvalidId");

        employee.Update(
            request.DepartmentId,
            request.ManagerId,
            request.WorkShiftId,
            request.EmployeeCode.Trim(),
            request.JobTitle.Trim(),
            request.HireDate);

        if (request.IsActive)
            employee.Active();
        else
            employee.InActive();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
