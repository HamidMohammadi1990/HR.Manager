using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.UserRoles.Queries;
using JavidHrm.Application.Features.UserRoles.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management User Roles For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("user-role")]
[ApiControllerCategory(ApiControllerCategory.AccessControl)]
[ControllerInfo(PermissionType.ManageUserRole, PermissionType.ManageUserRoleGroup)]
public class UserRoleController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListUserRole)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllUserRoleResponse>>> GetAll(GetAllUserRoleRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetUserRoleById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetUserRoleResponse?>> Get(GetUserRoleRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.AssignUserRole)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateUserRoleResponse>> Create(CreateUserRoleRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteUserRole)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteUserRoleRequest request)
        => await mediator.Send(request);
}
