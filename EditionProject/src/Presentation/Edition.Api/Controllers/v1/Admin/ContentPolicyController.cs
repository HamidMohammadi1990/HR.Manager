using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.ContentPolicies.Queries;
using JavidHrm.Application.Features.ContentPolicies.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

[ApiVersion("1")]
[ControllerName("content-policy")]
[ApiControllerCategory(ApiControllerCategory.ContentPolicy)]
[ControllerInfo(PermissionType.ManageContentPolicy, PermissionType.ManageContentPolicyGroup)]
public class ContentPolicyController
    (ISender mediator)
    : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListContentPolicy)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllContentPolicyResponse>>> GetAll(GetAllContentPolicyRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetContentPolicyById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetContentPolicyResponse?>> Get(GetContentPolicyRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateContentPolicy)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateContentPolicyResponse>> Create(CreateContentPolicyRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.UpdateContentPolicy)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateContentPolicyRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteContentPolicy)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteContentPolicyRequest request)
        => await mediator.Send(request);
}
