using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.FinancialYears.Queries;
using JavidHrm.Application.Features.FinancialYears.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Financial Years For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("financial-year")]
[ApiControllerCategory(ApiControllerCategory.Financial)]
[ControllerInfo(PermissionType.ManageFinancialYear, PermissionType.ManageFinancialGroup)]
public class FinancialYearController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListFinancialYear)]
    [HttpGet("get-all")]
    public async Task<ApiResult<PagedResult<GetAllFinancialYearResponse>>> GetAll(GetAllFinancialYearRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetFinancialYearById)]
    [HttpGet("get")]
    public async Task<ApiResult<GetFinancialYearResponse?>> Get(GetFinancialYearRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateFinancialYear)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateFinancialYearResponse>> Create(CreateFinancialYearRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateFinancialYear)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateFinancialYearRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteFinancialYear)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteFinancialYearRequest request)
        => await mediator.Send(request);
}
