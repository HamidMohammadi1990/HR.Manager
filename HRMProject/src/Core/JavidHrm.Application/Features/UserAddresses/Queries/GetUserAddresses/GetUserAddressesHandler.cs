using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public record GetUserAddressesHandler
	: IRequestHandler<GetUserAddressesRequest, OperationResult<PagedResult<GetUserAddressesResponse>>>
{
	private readonly IUserAddressMapperService mapper;
	private readonly ICurrentUserContext currentUser;
	private readonly IUserAddressRepository userAddressRepository;
	private readonly IContentPolicyFilterContext contentPolicyFilterContext;

	public GetUserAddressesHandler(
		ICurrentUserContext currentUser,
		IUserAddressRepository userAddressRepository,
		IUserAddressMapperService mapper,
		IContentPolicyFilterContext contentPolicyFilterContext)
	{
		this.mapper = mapper;
		this.currentUser = currentUser;
		this.userAddressRepository = userAddressRepository;
		this.contentPolicyFilterContext = contentPolicyFilterContext;
	}

	public async Task<OperationResult<PagedResult<GetUserAddressesResponse>>> Handle(GetUserAddressesRequest request, CancellationToken cancellationToken)
	{
		var userId = currentUser.UserId;
		var requestModel = mapper.Map(request, userId);
		var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.UserAddress>();
		var addresses = await userAddressRepository.GetUserAddressAsync(requestModel, filter);
		var result = mapper.Map(addresses);
		return result;
	}
}