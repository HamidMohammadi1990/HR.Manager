using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Employees.Commands;

public class DeleteEmployeeHandler
    (IEmployeeRepository employeeRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteEmployeeRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteEmployeeRequest request, CancellationToken cancellationToken)
    {
        var employee = await employeeRepository.FindAsync(request.Id, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        var hasReports = await employeeRepository.AnyAsync(x => x.ManagerId == request.Id, cancellationToken);
        if (hasReports)
            return ErrorModel.Create("InvalidOperation");

        employeeRepository.Remove(employee);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
