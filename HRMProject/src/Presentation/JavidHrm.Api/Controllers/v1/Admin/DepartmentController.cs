using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Departments.Queries;
using JavidHrm.Application.Features.Departments.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Departments For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("department")]
[ApiControllerCategory(ApiControllerCategory.Department)]
[ControllerInfo(PermissionType.ManageDepartment, PermissionType.ManageDepartmentGroup)]
public class DepartmentController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListDepartment)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllDepartmentResponse>>> GetAll(GetAllDepartmentRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetDepartmentById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetDepartmentResponse?>> Get(GetDepartmentRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateDepartment)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateDepartmentResponse>> Create(CreateDepartmentRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateDepartment)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateDepartmentRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteDepartment)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteDepartmentRequest request)
        => await mediator.Send(request);
}
