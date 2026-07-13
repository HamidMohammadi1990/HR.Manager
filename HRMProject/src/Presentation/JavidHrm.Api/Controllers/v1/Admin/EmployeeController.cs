using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Employees.Queries;
using JavidHrm.Application.Features.Employees.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Employees For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("employee")]
[ApiControllerCategory(ApiControllerCategory.Employee)]
[ControllerInfo(PermissionType.ManageEmployee, PermissionType.ManageEmployeeGroup)]
public class EmployeeController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListEmployee)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllEmployeeResponse>>> GetAll(GetAllEmployeeRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetEmployeeById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetEmployeeResponse?>> Get(GetEmployeeRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateEmployee)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateEmployeeResponse>> Create(CreateEmployeeRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateEmployee)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateEmployeeRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteEmployee)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteEmployeeRequest request)
        => await mediator.Send(request);
}
