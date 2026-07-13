using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.UserAddresses.Queries;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management User Address For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("user-address")]
[ApiControllerCategory(ApiControllerCategory.Users)]
[ControllerInfo(PermissionType.ManageUserAddress, PermissionType.ManageUserAddressGroup)]
public class UserAddressController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListUserAddress)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllUserAddressResponse>>> GetAll(GetAllUserAddressRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetUserAddressById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetUserAddressResponse?>> Get(GetUserAddressRequest request)
        => await mediator.Send(request);
}
