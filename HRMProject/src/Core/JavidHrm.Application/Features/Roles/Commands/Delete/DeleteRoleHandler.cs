using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Roles.Commands;

public class DeleteRoleHandler
    (IUnitOfWork uow, IRoleRepository roleRepository)
    : IRequestHandler<DeleteRoleRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await roleRepository.FindAsync(request.Id);
        if (role is null)
            return ErrorModel.Create("InvalidId");

        roleRepository.Remove(role);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}