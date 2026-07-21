using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Departments.Commands;

public class CreateDepartmentHandler
    (IUnitOfWork uow, IDepartmentRepository departmentRepository, ICurrentUserContext currentUser)
    : IRequestHandler<CreateDepartmentRequest, OperationResult<CreateDepartmentResponse>>
{
    public async Task<OperationResult<CreateDepartmentResponse>> Handle(CreateDepartmentRequest request, CancellationToken cancellationToken)
    {
        var department = Domain.Entities.Department.Create(
            currentUser.UserId,
            request.Name.Trim(),
            request.Code.Trim(),
            request.Description?.Trim(),
            request.ParentDepartmentId,
            request.DefaultWorkShiftId);

        if (request.IsActive)
            department.Active();
        else
            department.InActive();

        departmentRepository.Add(department);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateDepartmentResponse>();

        return new CreateDepartmentResponse { Id = department.Id };
    }
}
