using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Banks;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Banks.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IBankMapperService : IMapper
{
    GetBankResponse Map(Bank model);
    GetAllBankRequestDto Map(GetAllBankRequest model);
    SearchBankRequestDto Map(SearchBankRequest model);
    PagedResult<GetAllBankResponse> Map(PagedResult<Bank> model);
    PagedResult<SearchBankResponse> MapToSearch(PagedResult<Bank> model);
}
