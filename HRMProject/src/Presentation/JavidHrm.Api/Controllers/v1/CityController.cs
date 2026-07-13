using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Cities.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management Cities
/// </summary>
[ApiVersion("1")]
[ControllerName("city")]
[ApiControllerCategory(ApiControllerCategory.Location)]
public class CityController
    (ISender mediator)
    : BaseApiController
{
    [HttpPost("search")]
    public async Task<ApiResult<PagedResult<SearchCityResponse>>> Search(SearchCityRequest request)
        => await mediator.Send(request);
}