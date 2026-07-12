using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Provinces;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Provinces.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IProvinceMapperService : IMapper
{
    GetProvinceResponse Map(Province province);
    GetAllProvinceRequestDto Map(GetAllProvinceRequest model);
    SearchProvinceRequestDto Map(SearchProvinceRequest model);
    PagedResult<GetAllProvinceResponse> Map(PagedResult<GetAllProvinceResponseDto> model);
    PagedResult<SearchProvinceResponse> Map(PagedResult<SearchProvinceResponseDto> model);
}