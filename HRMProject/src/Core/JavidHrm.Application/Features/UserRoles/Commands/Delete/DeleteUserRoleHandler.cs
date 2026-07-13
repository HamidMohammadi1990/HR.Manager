using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.UserRoles.Commands;

public class DeleteUserRoleHandler
    (IUnitOfWork uow, IUserRoleRepository userRoleRepository, IContentPolicyCache contentPolicyCache)
    : IRequestHandler<DeleteUserRoleRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteUserRoleRequest request, CancellationToken cancellationToken)
    {
        var userRole = await userRoleRepository.FindAsync(request.Id);
        if (userRole is null)
            return ErrorModel.Create("InvalidId");

        var userId = userRole.UserId;
        userRoleRepository.Remove(userRole);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        await contentPolicyCache.InvalidateUserAsync(userId, cancellationToken);
        return OperationResult.Success();
    }
}
