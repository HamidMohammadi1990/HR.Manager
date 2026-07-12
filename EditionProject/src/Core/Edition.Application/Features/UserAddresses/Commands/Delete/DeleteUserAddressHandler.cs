using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public class DeleteUserAddressHandler 
    (IUserAddressRepository userAddressRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteUserAddressRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteUserAddressRequest request, CancellationToken cancellationToken)
    {
        var userAddress = await userAddressRepository.FindAsync(request.Id);
        if (userAddress is null)
            return ErrorModel.Create("InvalidId");

        userAddressRepository.Remove(userAddress);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}