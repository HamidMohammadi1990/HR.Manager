using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.Provinces.Queries;

public class GetAllProvinceHandler
    (IProvinceRepository provinceRepository, IProvinceMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllProvinceRequest, OperationResult<PagedResult<GetAllProvinceResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllProvinceResponse>>> Handle(GetAllProvinceRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Province>();
        var provinces = await provinceRepository.GetAllAsync(requestModel, filter);
        var result = mapper.Map(provinces);
        return result;
    }
}