using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.ChartOfAccounts;
using JavidHrm.Application.Features.ChartOfAccounts.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IChartOfAccountMapperService : IMapper
{
    GetChartOfAccountResponse Map(ChartOfAccount model);
    GetAllChartOfAccountRequestDto Map(GetAllChartOfAccountRequest model);
    PagedResult<GetAllChartOfAccountResponse> Map(PagedResult<GetAllChartOfAccountDto> model);
}