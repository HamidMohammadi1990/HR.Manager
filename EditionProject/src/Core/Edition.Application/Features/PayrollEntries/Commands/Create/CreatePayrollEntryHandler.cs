using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class CreatePayrollEntryHandler
    (IUnitOfWork uow, IPayrollEntryRepository payrollEntryRepository)
    : IRequestHandler<CreatePayrollEntryRequest, OperationResult<CreatePayrollEntryResponse>>
{
    public async Task<OperationResult<CreatePayrollEntryResponse>> Handle(CreatePayrollEntryRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = Domain.Entities.PayrollEntry.Create(
            request.EmployeeId,
            request.Year,
            request.Month,
            request.BaseSalary,
            request.GrossAmount,
            request.Deductions,
            request.NetAmount,
            request.Status,
            request.Notes?.Trim());

        payrollEntryRepository.Add(payrollEntry);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreatePayrollEntryResponse>();

        return new CreatePayrollEntryResponse { Id = payrollEntry.Id };
    }
}
