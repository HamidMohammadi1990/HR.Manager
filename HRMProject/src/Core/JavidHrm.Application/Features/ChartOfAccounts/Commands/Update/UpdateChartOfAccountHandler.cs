using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.ChartOfAccounts.Commands;

public class UpdateChartOfAccountHandler
    (IUnitOfWork uow, IChartOfAccountRepository chartOfAccountRepository)
    : IRequestHandler<UpdateChartOfAccountRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateChartOfAccountRequest request, CancellationToken cancellationToken)
    {
        var chartOfAccount = await chartOfAccountRepository.FindAsync(request.Id, cancellationToken);
        if (chartOfAccount is null)
            return ErrorModel.Create("InvalidId");

        chartOfAccount.Update(
            request.Level,
            request.AccountCode,
            request.AccountTitle,
            request.AccountType,
            request.DetailType,            
            request.ParentId);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}