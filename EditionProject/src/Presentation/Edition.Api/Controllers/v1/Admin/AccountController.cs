using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Users.Queries;
using JavidHrm.Application.Features.Users.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management User Account For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("account")]
[ApiControllerCategory(ApiControllerCategory.Authentication)]
[ControllerInfo(PermissionType.ManageUsers, PermissionType.ManageUsersGroup)]
public class AccountController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListUser)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllUserResponse>>> GetAll(GetAllUserRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetUserById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetUserResponse?>> Get(GetUserRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateUser)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateUserResponse>> Create(CreateUserRequest request)
        => await mediator.Send(request);
}
