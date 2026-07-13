using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.UserAddresses;
using JavidHrm.Application.Features.UserAddresses.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IUserAddressMapperService : IMapper
{
    GetUserAddressResponse Map(UserAddress userAddress);
    PagedResult<GetUserAddressesResponse> Map(PagedResult<GetUserAddressDto> model);
    GetAllUserAddressRequestDto Map(GetAllUserAddressRequest model);
    PagedResult<GetAllUserAddressResponse> Map(PagedResult<GetAllUserAddressDto> model);	
    GetUserAddressesRequestDto Map(GetUserAddressesRequest model, int userId);
}