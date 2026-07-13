using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Provinces.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management Provinces
/// </summary>
[ApiVersion("1")]
[ControllerName("province")]
[ApiControllerCategory(ApiControllerCategory.Location)]
public class ProvinceController
    (ISender mediator)
    : BaseApiController
{
    [HttpPost("search")]
    public async Task<ApiResult<PagedResult<SearchProvinceResponse>>> Search(SearchProvinceRequest request)
        => await mediator.Send(request);
}