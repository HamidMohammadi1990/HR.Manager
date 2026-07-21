using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;
using JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Leave Type Definitions For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("leave-type-definition")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageLeaveTypeDefinition, PermissionType.ManageLeaveTypeDefinitionGroup)]
public class LeaveTypeDefinitionController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListLeaveTypeDefinition)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllLeaveTypeDefinitionResponse>>> GetAll(GetAllLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetLeaveTypeDefinitionById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetLeaveTypeDefinitionResponse?>> Get(GetLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateLeaveTypeDefinition)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateLeaveTypeDefinitionResponse>> Create(CreateLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateLeaveTypeDefinition)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteLeaveTypeDefinition)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);
}
