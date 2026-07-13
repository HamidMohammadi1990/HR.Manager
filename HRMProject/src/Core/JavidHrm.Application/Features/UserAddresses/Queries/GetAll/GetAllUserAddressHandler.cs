using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetAllUserAddressHandler
    (IUserAddressRepository userAddressRepository, IUserAddressMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllUserAddressRequest, OperationResult<PagedResult<GetAllUserAddressResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllUserAddressResponse>>> Handle(GetAllUserAddressRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.UserAddress>();
        var addresses = await userAddressRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(addresses);
        return result;
    }
}