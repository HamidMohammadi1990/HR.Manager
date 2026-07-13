using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Roles.Commands;

public class CreateRoleHandler
    (IUnitOfWork uow, IRoleRepository roleRepository)
    : IRequestHandler<CreateRoleRequest, OperationResult<CreateRoleResponse>>
{
    public async Task<OperationResult<CreateRoleResponse>> Handle(CreateRoleRequest request, CancellationToken cancellationToken)
    {
        var role = Role.Create(request.Title);
        roleRepository.Add(role);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateRoleResponse>();

        return new CreateRoleResponse { Id = role.Id };
    }
}