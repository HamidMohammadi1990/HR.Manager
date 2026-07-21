using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Application.Features.EmployeeShiftSchedules.Commands;
using JavidHrm.Application.Features.EmployeeShiftSchedules.Queries;

namespace JavidHrm.Api.Controllers.v1.Admin;

[ApiVersion("1")]
[ControllerName("employee-shift-schedule")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageEmployeeShiftSchedule, PermissionType.ManageEmployeeShiftScheduleGroup)]
public class EmployeeShiftScheduleController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListEmployeeShiftSchedule)]
    [HttpPost("get-by-employee")]
    public async Task<ApiResult<IReadOnlyList<EmployeeShiftScheduleResponse>>> GetByEmployee(GetEmployeeShiftSchedulesRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateEmployeeShiftSchedule)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateEmployeeShiftScheduleResponse>> Create(CreateEmployeeShiftScheduleRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteEmployeeShiftSchedule)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteEmployeeShiftScheduleRequest request)
        => await mediator.Send(request);
}
