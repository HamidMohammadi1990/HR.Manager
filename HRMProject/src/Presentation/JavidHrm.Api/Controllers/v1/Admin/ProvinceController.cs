using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Provinces.Queries;
using JavidHrm.Application.Features.Provinces.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Provinces For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("province")]
[ApiControllerCategory(ApiControllerCategory.Location)]
[ControllerInfo(PermissionType.ManageProvince, PermissionType.ManageLocationGroup)]
public class ProvinceController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListProvince)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllProvinceResponse>>> GetAll(GetAllProvinceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetProvinceById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetProvinceResponse>> Get(GetProvinceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateProvince)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateProvinceResponse>> Create(CreateProvinceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateProvince)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateProvinceRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteProvince)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteProvinceRequest request)
        => await mediator.Send(request);
}
