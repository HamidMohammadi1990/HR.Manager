using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Announcements.Queries;
using JavidHrm.Application.Features.Announcements.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Announcements For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("announcement")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageAnnouncement, PermissionType.ManageAnnouncementGroup)]
public class AnnouncementController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListAnnouncement)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllAnnouncementResponse>>> GetAll(GetAllAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetAnnouncementById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetAnnouncementResponse?>> Get(GetAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateAnnouncement)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateAnnouncementResponse>> Create(CreateAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateAnnouncement)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.PublishAnnouncement)]
    [HttpPut("publish")]
    public async Task<ApiResult<OperationResult>> Publish(PublishAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.ArchiveAnnouncement)]
    [HttpPut("archive")]
    public async Task<ApiResult<OperationResult>> Archive(ArchiveAnnouncementRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteAnnouncement)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteAnnouncementRequest request)
        => await mediator.Send(request);
}
