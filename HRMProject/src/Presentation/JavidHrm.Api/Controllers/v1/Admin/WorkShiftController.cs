using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.WorkShifts.Queries;
using JavidHrm.Application.Features.WorkShifts.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Work Shifts For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("work-shift")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageWorkShift, PermissionType.ManageWorkShiftGroup)]
public class WorkShiftController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListWorkShift)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllWorkShiftResponse>>> GetAll(GetAllWorkShiftRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetWorkShiftById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetWorkShiftResponse?>> Get(GetWorkShiftRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateWorkShift)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateWorkShiftResponse>> Create(CreateWorkShiftRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateWorkShift)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateWorkShiftRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteWorkShift)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteWorkShiftRequest request)
        => await mediator.Send(request);
}
