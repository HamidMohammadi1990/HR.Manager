using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using MediatR;

namespace JavidHrm.Application.Features.Users.Commands;

public class UpdateCurrentUserProfileHandler
    (IUnitOfWork uow, IUserRepository userRepository, ICurrentUserContext currentUser)
    : IRequestHandler<UpdateCurrentUserProfileRequest, OperationResult>
{
    public async Task<OperationResult> Handle(
        UpdateCurrentUserProfileRequest request,
        CancellationToken cancellationToken = default)
    {
        var userId = currentUser.UserId;
        if (userId <= 0)
            return ErrorModel.Create("AccessDenied");

        var user = await userRepository.FindAsync(userId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("UserNotFound");

        var duplicateExists = await userRepository.AnyAsync(x =>
            x.Id != userId &&
            (x.PhoneNumber == request.PhoneNumber || x.UserName == request.PhoneNumber),
            cancellationToken);

        if (duplicateExists)
            return ErrorModel.Create("AnAccountWithThisInfoHasAleardyBeenRegistered");

        user.Update(
            user.UserName,
            request.FirstName,
            request.LastName,
            user.Email,
            request.PhoneNumber,
            request.CityId,
            request.Gender,
            user.IsActive,
            user.LoginPermission);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
