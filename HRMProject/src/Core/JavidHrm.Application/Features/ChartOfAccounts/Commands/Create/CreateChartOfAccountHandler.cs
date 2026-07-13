using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.ChartOfAccounts.Commands;

public class CreateChartOfAccountHandler
    (IUnitOfWork uow, IChartOfAccountRepository chartOfAccountRepository)
    : IRequestHandler<CreateChartOfAccountRequest, OperationResult<CreateChartOfAccountResponse>>
{
    public async Task<OperationResult<CreateChartOfAccountResponse>> Handle(CreateChartOfAccountRequest request, CancellationToken cancellationToken)
    {
        var chartOfAccount = ChartOfAccount.Create(
            request.Level,
            request.AccountCode,
            request.AccountTitle,
            request.AccountType,
            request.DetailType,
            request.ParentId);

        chartOfAccountRepository.Add(chartOfAccount);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateChartOfAccountResponse>();

        return new CreateChartOfAccountResponse { Id = chartOfAccount.Id };
    }
}