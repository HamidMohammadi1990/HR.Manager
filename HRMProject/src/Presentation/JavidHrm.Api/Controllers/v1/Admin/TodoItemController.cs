using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.TodoItems.Queries;
using JavidHrm.Application.Features.TodoItems.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Todo Items For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("todo-item")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageTodoItem, PermissionType.ManageTodoItemGroup)]
public class TodoItemController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListTodoItem)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllTodoItemResponse>>> GetAll(GetAllTodoItemRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetTodoItemById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetTodoItemResponse?>> Get(GetTodoItemRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateTodoItem)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateTodoItemResponse>> Create(CreateTodoItemRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateTodoItem)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateTodoItemRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.ToggleCompleteTodoItem)]
    [HttpPut("toggle-complete")]
    public async Task<ApiResult<OperationResult>> ToggleComplete(ToggleCompleteTodoItemRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteTodoItem)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteTodoItemRequest request)
        => await mediator.Send(request);
}
