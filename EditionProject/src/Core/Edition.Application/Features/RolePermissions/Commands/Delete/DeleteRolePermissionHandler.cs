using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public class DeleteRolePermissionHandler
    (IUnitOfWork uow, IRolePermissionRepository rolePermissionRepository)
    : IRequestHandler<DeleteRolePermissionRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteRolePermissionRequest request, CancellationToken cancellationToken)
    {
        var rolePermission = await rolePermissionRepository.FindAsync(request.Id);
        if (rolePermission is null)
            return ErrorModel.Create("InvalidId");

        rolePermissionRepository.Remove(rolePermission);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}
