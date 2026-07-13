using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public class GetAllLeaveRequestHandler
    (ILeaveRequestRepository leaveRequestRepository, ILeaveRequestMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllLeaveRequestRequest, OperationResult<PagedResult<GetAllLeaveRequestResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllLeaveRequestResponse>>> Handle(GetAllLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.LeaveRequest>();
        var leaveRequests = await leaveRequestRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(leaveRequests);
    }
}
