using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public class GetFinancialYearHandler
    (IFinancialYearRepository financialYearRepository, IFinancialYearMapperService mapper)
    : IRequestHandler<GetFinancialYearRequest, OperationResult<GetFinancialYearResponse>>
{
    public async Task<OperationResult<GetFinancialYearResponse>> Handle(GetFinancialYearRequest request, CancellationToken cancellationToken)
    {
        var financialYear = await financialYearRepository.GetAsNoTrackingAsync(request.Id);
        if (financialYear is null)
            return ErrorModel.Create("InvalidFinancialYearId");

        var result = mapper.Map(financialYear);
        return result;
    }
}