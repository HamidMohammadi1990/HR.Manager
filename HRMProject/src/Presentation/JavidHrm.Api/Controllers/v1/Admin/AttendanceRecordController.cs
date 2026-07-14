using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.AttendanceRecords.Queries;
using JavidHrm.Application.Features.AttendanceRecords.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Attendance Records For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("attendance-record")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageAttendance, PermissionType.ManageAttendanceGroup)]
public class AttendanceRecordController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListAttendance)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllAttendanceRecordResponse>>> GetAll(GetAllAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetAttendanceById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetAttendanceRecordResponse?>> Get(GetAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateAttendance)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateAttendanceRecordResponse>> Create(CreateAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CheckInAttendance)]
    [HttpPut("check-in")]
    public async Task<ApiResult<CheckInAttendanceRecordResponse>> CheckIn(CheckInAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CheckOutAttendance)]
    [HttpPut("check-out")]
    public async Task<ApiResult<CheckOutAttendanceRecordResponse>> CheckOut(CheckOutAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateAttendance)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateAttendanceRecordRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteAttendance)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteAttendanceRecordRequest request)
        => await mediator.Send(request);
}
