using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Application.Features.WebSiteSettings.Queries;
using JavidHrm.Application.Features.WebSiteSettings.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management WebSiteSetting For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("website-setting")]
[ApiControllerCategory(ApiControllerCategory.General)]
[ControllerInfo(PermissionType.ManageWebSiteSetting, PermissionType.ManageCmsGroup)]
public class WebSiteSettingController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.GetWebSiteSettingById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetWebSiteSettingResponse>> Get(GetWebSiteSettingRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateWebSiteSetting)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateWebSiteSettingRequest request)
        => await mediator.Send(request);
}
