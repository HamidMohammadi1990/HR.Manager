using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Permissions.Commands;

public class UpdatePermissionHandler
    (IUnitOfWork uow, IPermissionRepository permissionRepository)
    : IRequestHandler<UpdatePermissionRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdatePermissionRequest request, CancellationToken cancellationToken)
    {
        var permission = await permissionRepository.FindAsync(request.Id);
        if (permission is null)
            return ErrorModel.Create("InvalidId");

        permission.Update(request.Title, request.Url, request.NameSpace, request.Priority, request.IsActive);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}
