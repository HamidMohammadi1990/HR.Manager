using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.FinancialYears.Commands;

public class DeleteFinancialYearHandler
    (IUnitOfWork uow, IFinancialYearRepository financialYearRepository)
    : IRequestHandler<DeleteFinancialYearRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteFinancialYearRequest request, CancellationToken cancellationToken)
    {
        var financialYear = await financialYearRepository.FindAsync(request.Id, cancellationToken);
        if (financialYear is null)
            return ErrorModel.Create("InvalidFinancialYearId");

        financialYear.DeActive();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult;

        return OperationResult.Success();
    }
}