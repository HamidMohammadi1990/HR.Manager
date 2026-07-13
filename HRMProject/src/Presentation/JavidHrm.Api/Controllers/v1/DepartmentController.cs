using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Departments.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management Departments
/// </summary>
[ApiVersion("1")]
[ControllerName("department")]
[ApiControllerCategory(ApiControllerCategory.Department)]
public class DepartmentController
    (ISender mediator)
    : BaseApiController
{
    [HttpPost("search")]
    public async Task<ApiResult<PagedResult<SearchDepartmentResponse>>> Search(SearchDepartmentRequest request)
        => await mediator.Send(request);
}
