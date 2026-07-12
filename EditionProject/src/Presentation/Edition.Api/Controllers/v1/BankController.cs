using MediatR;
using Asp.Versioning;
using JavidHrm.WebFramework.Api;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Banks.Queries;

using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;

namespace JavidHrm.Api.Controllers.v1;

/// <summary>
/// Management Banks
/// </summary>
[ApiVersion("1")]
[ControllerName("bank")]
[ApiControllerCategory(ApiControllerCategory.Financial)]
public class BankController
    (ISender mediator)
    : BaseApiController
{
    [HttpPost("search")]
    public async Task<ApiResult<PagedResult<SearchBankResponse>>> Search(SearchBankRequest request)
        => await mediator.Send(request);
}
