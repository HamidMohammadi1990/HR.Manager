using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Departments.Commands;

public class DeleteDepartmentHandler
    (IDepartmentRepository departmentRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteDepartmentRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = await departmentRepository.FindAsync(request.Id, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        departmentRepository.Remove(department);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}
