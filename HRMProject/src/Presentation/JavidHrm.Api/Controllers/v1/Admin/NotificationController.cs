using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Notifications.Queries;
using JavidHrm.Application.Features.Notifications.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Notifications For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("notification")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageNotification, PermissionType.ManageNotificationGroup)]
public class NotificationController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListNotification)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllNotificationResponse>>> GetAll(GetAllNotificationRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetNotificationById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetNotificationResponse?>> Get(GetNotificationRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetUnreadNotificationCount)]
    [HttpPost("get-unread-count")]
    public async Task<ApiResult<GetUnreadNotificationCountResponse>> GetUnreadCount(GetUnreadNotificationCountRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateNotification)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateNotificationResponse>> Create(CreateNotificationRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateNotification)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateNotificationRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.MarkNotificationRead)]
    [HttpPut("mark-read")]
    public async Task<ApiResult<OperationResult>> MarkRead(MarkNotificationReadRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.MarkAllNotificationsRead)]
    [HttpPut("mark-all-read")]
    public async Task<ApiResult<OperationResult>> MarkAllRead(MarkAllNotificationsReadRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteNotification)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteNotificationRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteReadNotifications)]
    [HttpDelete("delete-read")]
    public async Task<ApiResult<OperationResult>> DeleteRead(DeleteReadNotificationsRequest request)
        => await mediator.Send(request);
}
