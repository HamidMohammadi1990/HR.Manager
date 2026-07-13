using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.PayrollEntries.Queries;
using JavidHrm.Application.Features.PayrollEntries.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Payroll Entries For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("payroll-entry")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManagePayroll, PermissionType.ManagePayrollGroup)]
public class PayrollEntryController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListPayroll)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllPayrollEntryResponse>>> GetAll(GetAllPayrollEntryRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetPayrollById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetPayrollEntryResponse?>> Get(GetPayrollEntryRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreatePayroll)]
    [HttpPost("create")]
    public async Task<ApiResult<CreatePayrollEntryResponse>> Create(CreatePayrollEntryRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdatePayroll)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdatePayrollEntryRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdatePayroll)]
    [HttpPut("approve")]
    public async Task<ApiResult<OperationResult>> Approve(ApprovePayrollEntryRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdatePayroll)]
    [HttpPut("mark-paid")]
    public async Task<ApiResult<OperationResult>> MarkPaid(MarkPayrollEntryPaidRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeletePayroll)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeletePayrollEntryRequest request)
        => await mediator.Send(request);
}
