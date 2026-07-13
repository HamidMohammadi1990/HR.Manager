using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.RolePermissions.Commands;

public class CreateRolePermissionHandler
    (IUnitOfWork uow, IRolePermissionRepository rolePermissionRepository)
    : IRequestHandler<CreateRolePermissionRequest, OperationResult<CreateRolePermissionResponse>>
{
    public async Task<OperationResult<CreateRolePermissionResponse>> Handle(CreateRolePermissionRequest request, CancellationToken cancellationToken)
    {
        var rolePermission = RolePermission.Create(request.RoleId, request.PermissionId);
        rolePermissionRepository.Add(rolePermission);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateRolePermissionResponse>();

        return new CreateRolePermissionResponse { Id = rolePermission.Id };
    }
}
