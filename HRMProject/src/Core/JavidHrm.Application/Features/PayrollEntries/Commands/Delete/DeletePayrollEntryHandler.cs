using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class DeletePayrollEntryHandler
    (IPayrollEntryRepository payrollEntryRepository, IUnitOfWork uow)
    : IRequestHandler<DeletePayrollEntryRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeletePayrollEntryRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = await payrollEntryRepository.FindAsync(request.Id, cancellationToken);
        if (payrollEntry is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (payrollEntry.Status == PayrollEntryStatus.Paid)
            return ErrorModel.Create(MessageKeys.PayrollEntryAlreadyPaid);

        payrollEntryRepository.Remove(payrollEntry);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
