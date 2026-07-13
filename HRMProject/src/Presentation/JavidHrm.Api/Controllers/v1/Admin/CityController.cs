using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Cities.Queries;
using JavidHrm.Application.Features.Cities.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Cities For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("city")]
[ApiControllerCategory(ApiControllerCategory.Location)]
[ControllerInfo(PermissionType.ManageCity, PermissionType.ManageLocationGroup)]
public class CityController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListCity)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllCityResponse>>> GetAll(GetAllCityRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetCityById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetCityResponse>> Get(GetCityRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateCity)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateCityResponse>> Create(CreateCityRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateCity)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateCityRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteCity)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteCityRequest request)
        => await mediator.Send(request);
}