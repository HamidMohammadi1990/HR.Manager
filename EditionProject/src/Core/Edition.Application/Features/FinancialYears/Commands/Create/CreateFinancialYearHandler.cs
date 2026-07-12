using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.FinancialYears.Commands;

public class CreateFinancialYearHandler
    (IUnitOfWork uow, IFinancialYearRepository financialYearRepository)
    : IRequestHandler<CreateFinancialYearRequest, OperationResult<CreateFinancialYearResponse>>
{
    public async Task<OperationResult<CreateFinancialYearResponse>> Handle(CreateFinancialYearRequest request, CancellationToken cancellationToken)
    {
        var financialYear = FinancialYear.Create(
            request.Name,
            request.StartDate,
            request.EndDate,
            request.DepartmentId);

        financialYearRepository.Add(financialYear);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateFinancialYearResponse>();

        return new CreateFinancialYearResponse { Id = financialYear.Id };
    }
}