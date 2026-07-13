using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class MarkPayrollEntryPaidHandler
    (IPayrollEntryRepository payrollEntryRepository, IUnitOfWork uow)
    : IRequestHandler<MarkPayrollEntryPaidRequest, OperationResult>
{
    public async Task<OperationResult> Handle(MarkPayrollEntryPaidRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = await payrollEntryRepository.FindAsync(request.Id, cancellationToken);
        if (payrollEntry is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (payrollEntry.Status != PayrollEntryStatus.Approved)
            return ErrorModel.Create(MessageKeys.PayrollEntryNotApproved);

        payrollEntry.MarkAsPaid();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
