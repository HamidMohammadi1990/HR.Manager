using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.LeaveBalances.Queries;
using JavidHrm.Application.Features.LeaveBalances.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Leave Balances For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("leave-balance")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageLeaveBalance, PermissionType.ManageLeaveBalanceGroup)]
public class LeaveBalanceController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListLeaveBalance)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllLeaveBalanceResponse>>> GetAll(GetAllLeaveBalanceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetLeaveBalanceById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetLeaveBalanceResponse?>> Get(GetLeaveBalanceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetEmployeeLeaveBalance)]
    [HttpPost("get-for-employee")]
    public async Task<ApiResult<GetEmployeeLeaveBalanceResponse?>> GetForEmployee(GetEmployeeLeaveBalanceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateLeaveBalance)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateLeaveBalanceResponse>> Create(CreateLeaveBalanceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateLeaveBalance)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateLeaveBalanceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteLeaveBalance)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteLeaveBalanceRequest request)
        => await mediator.Send(request);
}
