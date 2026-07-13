using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Provinces.Queries;

public class SearchProvinceHandler
    (IProvinceRepository provinceRepository, IProvinceMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<SearchProvinceRequest, OperationResult<PagedResult<SearchProvinceResponse>>>
{
    public async Task<OperationResult<PagedResult<SearchProvinceResponse>>> Handle(SearchProvinceRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Province>();
        var provinces = await provinceRepository.SearchAsync(requestModel, filter);
        var result = mapper.Map(provinces);
        return result;
    }
}