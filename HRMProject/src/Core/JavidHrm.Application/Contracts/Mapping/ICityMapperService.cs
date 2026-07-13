using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Cities;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.Cities.Queries;

namespace JavidHrm.Application.Contracts.Mapping;

public interface ICityMapperService : IMapper
{
    GetCityResponse Map(City model);
    GetAllCityRequestDto Map(GetAllCityRequest model);
    SearchCityRequestDto Map(SearchCityRequest model);
    PagedResult<GetAllCityResponse> Map(PagedResult<GetAllCityResponseDto> model);
    PagedResult<SearchCityResponse> Map(PagedResult<SearchCityResponseDto> model);
}