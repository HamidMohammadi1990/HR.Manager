using MediatR;
using Asp.Versioning;
using JavidHrm.Common.Models;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using Microsoft.AspNetCore.Authorization;
using JavidHrm.Application.Features.UserAddresses.Queries;
using JavidHrm.Application.Features.UserAddresses.Commands;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management User Addresses
/// </summary>
[Authorize]
[ApiVersion("1")]
[ControllerName("user-address")]
[ApiControllerCategory(ApiControllerCategory.Users)]
public class UserAddressController
    (ISender mediator)
    : BaseApiController
{   
    [HttpPost("my")]
    public async Task<ApiResult<PagedResult<GetUserAddressesResponse>>> UserAddresses(GetUserAddressesRequest request)
        => await mediator.Send(request);

    [HttpPost("create")]
    public async Task<ApiResult<CreateUserAddressResponse>> Create(CreateUserAddressRequest request)
        => await mediator.Send(request);

    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateUserAddressRequest request)
        => await mediator.Send(request);

    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteUserAddressRequest request)
        => await mediator.Send(request);
}