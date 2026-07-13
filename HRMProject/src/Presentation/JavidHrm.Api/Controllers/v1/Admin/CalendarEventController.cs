using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.CalendarEvents.Queries;
using JavidHrm.Application.Features.CalendarEvents.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Calendar Events For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("calendar-event")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageCalendarEvent, PermissionType.ManageCalendarEventGroup)]
public class CalendarEventController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListCalendarEvent)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllCalendarEventResponse>>> GetAll(GetAllCalendarEventRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetCalendarEventById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetCalendarEventResponse?>> Get(GetCalendarEventRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateCalendarEvent)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateCalendarEventResponse>> Create(CreateCalendarEventRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateCalendarEvent)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateCalendarEventRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteCalendarEvent)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteCalendarEventRequest request)
        => await mediator.Send(request);
}
