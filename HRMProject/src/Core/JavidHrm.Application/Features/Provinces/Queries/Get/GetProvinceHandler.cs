using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Provinces.Queries;

public class GetProvinceHandler
    (IProvinceRepository provinceRepository, IProvinceMapperService mapper)
    : IRequestHandler<GetProvinceRequest, OperationResult<GetProvinceResponse>>
{
    public async Task<OperationResult<GetProvinceResponse>> Handle(GetProvinceRequest request, CancellationToken cancellationToken)
    {
        var province = await provinceRepository.GetAsNoTrackingAsync(request.Id);
        if (province is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(province);
        return result;
    }
}