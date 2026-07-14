using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.LeaveRequests.Queries;
using JavidHrm.Application.Features.LeaveRequests.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Leave Requests For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("leave-request")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageLeave, PermissionType.ManageLeaveGroup)]
public class LeaveRequestController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListLeave)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllLeaveRequestResponse>>> GetAll(GetAllLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetLeaveById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetLeaveRequestResponse?>> Get(GetLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateLeave)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateLeaveRequestResponse>> Create(CreateLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateLeave)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.ApproveLeave)]
    [HttpPut("approve")]
    public async Task<ApiResult<OperationResult>> Approve(ApproveLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.RejectLeave)]
    [HttpPut("reject")]
    public async Task<ApiResult<OperationResult>> Reject(RejectLeaveRequestRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteLeave)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteLeaveRequestRequest request)
        => await mediator.Send(request);
}
