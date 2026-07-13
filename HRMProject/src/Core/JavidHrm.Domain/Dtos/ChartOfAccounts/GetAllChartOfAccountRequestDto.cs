using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Dtos.ChartOfAccounts;

public record GetAllChartOfAccountRequestDto
{
    public int? Level { get; set; }
    public int? ParentId { get; init; }
    public string? AccountCode { get; init; }
    public string? AccountTitle { get; init; }
    public ChartOfAccountType? AccountType { get; init; }
    public ChartOfAccountDetailType? AccountDetailType { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}