using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public class GetChartOfAccountHandler
    (IChartOfAccountRepository chartOfAccountRepository, IChartOfAccountMapperService mapper)
    : IRequestHandler<GetChartOfAccountRequest, OperationResult<GetChartOfAccountResponse?>>
{
    public async Task<OperationResult<GetChartOfAccountResponse?>> Handle(GetChartOfAccountRequest request, CancellationToken cancellationToken)
    {
        var chartOfAccount = await chartOfAccountRepository.GetAsNoTrackingAsync(request.Id);
        if (chartOfAccount is null)
            return ErrorModel.Create("InvalidId");

        var result = mapper.Map(chartOfAccount);
        return result;
    }
}