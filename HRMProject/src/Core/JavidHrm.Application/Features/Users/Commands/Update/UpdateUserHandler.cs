using JavidHrm.Common.Models;
using JavidHrm.Common.Security;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Users.Commands;

public class UpdateUserHandler
    (IUnitOfWork uow, IUserRepository userRepository, IPasswordHasher passwordHasher)
    : IRequestHandler<UpdateUserRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateUserRequest request, CancellationToken cancellationToken = default)
    {
        var user = await userRepository.FindAsync(request.Id, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var duplicateExists = await userRepository.AnyAsync(x =>
            x.Id != request.Id &&
            (x.UserName == request.UserName ||
             x.UserName == request.PhoneNumber ||
             x.PhoneNumber == request.UserName ||
             x.PhoneNumber == request.PhoneNumber ||
             x.Email == request.Email ||
             x.UserName == request.Email),
            cancellationToken);

        if (duplicateExists)
            return ErrorModel.Create("AnAccountWithThisInfoHasAleardyBeenRegistered");

        user.Update(
            request.UserName,
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.CityId,
            request.Gender,
            request.IsActive,
            request.LoginPermission);

        if (!string.IsNullOrWhiteSpace(request.Password))
            user.UpdatePassword(passwordHasher.HashPassword(request.Password));

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
