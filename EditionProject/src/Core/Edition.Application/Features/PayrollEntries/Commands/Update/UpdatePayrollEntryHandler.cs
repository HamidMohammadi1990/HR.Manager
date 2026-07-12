using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class UpdatePayrollEntryHandler
    (IPayrollEntryRepository payrollEntryRepository, IUnitOfWork uow)
    : IRequestHandler<UpdatePayrollEntryRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdatePayrollEntryRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = await payrollEntryRepository.FindAsync(request.Id, cancellationToken);
        if (payrollEntry is null)
            return ErrorModel.Create("InvalidId");

        payrollEntry.Update(
            request.EmployeeId,
            request.Year,
            request.Month,
            request.BaseSalary,
            request.GrossAmount,
            request.Deductions,
            request.NetAmount,
            request.Status,
            request.Notes?.Trim());

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
