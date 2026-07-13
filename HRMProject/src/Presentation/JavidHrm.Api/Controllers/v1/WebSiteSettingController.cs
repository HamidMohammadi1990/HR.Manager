using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Application.Features.WebSiteSettings.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management WebSiteSetting
/// </summary>
[ApiVersion("1")]
[ControllerName("website-setting")]
[ApiControllerCategory(ApiControllerCategory.General)]
public class WebSiteSettingController
    (ISender mediator)
    : BaseApiController
{
    [HttpPost("get")]
    public async Task<ApiResult<GetPublicWebSiteSettingResponse>> Get(GetPublicWebSiteSettingRequest request)
        => await mediator.Send(request);
}
