using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public class GetAllWorkShiftHandler
    (IWorkShiftRepository workShiftRepository, IWorkShiftMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllWorkShiftRequest, OperationResult<PagedResult<GetAllWorkShiftResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllWorkShiftResponse>>> Handle(GetAllWorkShiftRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.WorkShift>();
        var workShifts = await workShiftRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(workShifts);
    }
}
