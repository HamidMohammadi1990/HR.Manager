using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Common.Extensions;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetAllLeaveBalanceHandler
    (ILeaveBalanceRepository leaveBalanceRepository, ILeaveBalanceMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllLeaveBalanceRequest, OperationResult<PagedResult<GetAllLeaveBalanceResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllLeaveBalanceResponse>>> Handle(GetAllLeaveBalanceRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.LeaveBalance>();
        var leaveBalances = await leaveBalanceRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(leaveBalances);
    }
}
