using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public record GetAllChartOfAccountRequest : IRequest<OperationResult<PagedResult<GetAllChartOfAccountResponse>>>, IContentPolicyFilteredRequest<ChartOfAccount>
{
    public int? Level { get; set; }
    public int? ParentId { get; init; }
    public string? AccountCode { get; init; }
    public string? AccountTitle { get; init; }
    public ChartOfAccountType? AccountType { get; init; }
    public ChartOfAccountDetailType? AccountDetailType { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}