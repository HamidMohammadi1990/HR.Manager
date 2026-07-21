using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management Leave Type Definitions
/// </summary>
[ApiVersion("1")]
[ControllerName("leave-type-definition")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
public class LeaveTypeDefinitionController(ISender mediator) : BaseApiController
{
    [HttpPost("search")]
    public async Task<ApiResult<PagedResult<SearchLeaveTypeDefinitionResponse>>> Search(SearchLeaveTypeDefinitionRequest request)
        => await mediator.Send(request);
}
