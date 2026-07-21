using JavidHrm.Common.Models;
using JavidHrm.Common.Security;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Users.Commands;

public class CreateUserHandler
    (IUnitOfWork uow, IUserRepository userRepository, IPasswordHasher passwordHasher)
    : IRequestHandler<CreateUserRequest, OperationResult<CreateUserResponse>>
{
    public async Task<OperationResult<CreateUserResponse>> Handle(CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        var isExistsUser = await
            userRepository
            .AnyAsync(x => x.UserName == request.UserName ||
                      x.UserName == request.PhoneNumber ||
                      x.PhoneNumber == request.UserName ||
                      x.PhoneNumber == request.PhoneNumber ||
                      x.Email == request.Email ||
                      x.UserName == request.Email);
        if (isExistsUser)
            return ErrorModel.Create("AnAccountWithThisInfoHasAleardyBeenRegistered");

        var passwordHash = passwordHasher.HashPassword(request.Password);
        var user = User.Create(request.Email, request.Gender, request.UserName, request.FirstName,
                               request.LastName, request.PhoneNumber, passwordHash, Guid.NewGuid().ToString());

        userRepository.Add(user);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateUserResponse>();

        return new CreateUserResponse { Id = user.Id };
    }
}