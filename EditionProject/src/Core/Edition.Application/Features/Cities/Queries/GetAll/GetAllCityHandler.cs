using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Cities.Queries;

public class GetAllCityHandler
    (ICityRepository cityRepository, ICityMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllCityRequest, OperationResult<PagedResult<GetAllCityResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllCityResponse>>> Handle(GetAllCityRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.City>();
        var cities = await cityRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(cities);
        return result;
    }
}