using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetUserAddressHandler 
    (IUserAddressRepository userAddressRepository, IUserAddressMapperService mapper)
    : IRequestHandler<GetUserAddressRequest, OperationResult<GetUserAddressResponse>>
{
    public async Task<OperationResult<GetUserAddressResponse>> Handle(GetUserAddressRequest request, CancellationToken cancellationToken)
    {
        var userAddress = await userAddressRepository.GetAsNoTrackingAsync(request.Id);
        if (userAddress is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(userAddress);
        return result;
    }
}