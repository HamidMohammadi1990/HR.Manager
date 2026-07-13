using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.FinancialYears;
using JavidHrm.Application.Features.FinancialYears.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IFinancialYearMapperService : IMapper
{
    GetFinancialYearResponse Map(FinancialYear model);
    PagedResult<GetAllFinancialYearResponse> Map(PagedResult<FinancialYear> model);
    GetAllFinancialYearRequestDto Map(GetAllFinancialYearRequest model);
}