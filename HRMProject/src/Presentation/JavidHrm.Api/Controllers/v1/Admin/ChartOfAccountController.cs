using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using Microsoft.AspNetCore.Authorization;
using JavidHrm.Application.Features.ChartOfAccounts.Queries;
using JavidHrm.Application.Features.ChartOfAccounts.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Chart Of Accounts For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("chart-of-account")]
[ApiControllerCategory(ApiControllerCategory.Financial)]
[ControllerInfo(PermissionType.ManageChartOfAccount, PermissionType.ManageFinancialGroup)]
public class ChartOfAccountController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListChartOfAccount)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllChartOfAccountResponse>>> GetAll(GetAllChartOfAccountRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetChartOfAccountById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetChartOfAccountResponse?>> Get(GetChartOfAccountRequest request)
        => await mediator.Send(request);

    [Authorize]
    [ActionInfo(PermissionType.CreateChartOfAccount)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateChartOfAccountResponse>> Create(CreateChartOfAccountRequest request)
        => await mediator.Send(request);

    [Authorize]
    [ActionInfo(PermissionType.UpdateChartOfAccount)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateChartOfAccountRequest request)
        => await mediator.Send(request);

    [Authorize]
    [ActionInfo(PermissionType.DeleteChartOfAccount)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteChartOfAccountRequest request)
        => await mediator.Send(request);
}
