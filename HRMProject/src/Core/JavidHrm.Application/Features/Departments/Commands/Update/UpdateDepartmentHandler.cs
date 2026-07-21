using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Departments.Commands;

public class UpdateDepartmentHandler
    (IDepartmentRepository departmentRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateDepartmentRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = await departmentRepository.FindAsync(request.Id, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        department.Update(
            request.Name.Trim(),
            request.Code.Trim(),
            request.Description?.Trim(),
            request.ParentDepartmentId,
            request.DefaultWorkShiftId);

        if (request.IsActive)
            department.Active();
        else
            department.InActive();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
