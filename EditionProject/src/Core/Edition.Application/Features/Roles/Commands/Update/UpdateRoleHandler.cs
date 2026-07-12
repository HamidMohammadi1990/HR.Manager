using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Roles.Commands;

public class UpdateRoleHandler
    (IUnitOfWork uow, IRoleRepository roleRepository)
    : IRequestHandler<UpdateRoleRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = await roleRepository.FindAsync(request.Id);
        if (role is null)
            return ErrorModel.Create("InvalidId");

        role.Update(request.Title, request.IsActive);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}