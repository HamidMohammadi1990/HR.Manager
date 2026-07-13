using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Users.Commands;

public class DeleteUserHandler
    (IUnitOfWork uow, IUserRepository userRepository)
    : IRequestHandler<DeleteUserRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteUserRequest request, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.FindAsync(request.Id, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        user.Deactivate();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
