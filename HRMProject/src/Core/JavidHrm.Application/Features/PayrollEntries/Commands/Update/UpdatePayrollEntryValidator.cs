using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public class UpdatePayrollEntryValidator : AbstractValidator<UpdatePayrollEntryRequest>
{
    public UpdatePayrollEntryValidator(
        IPayrollEntryRepository payrollEntryRepository,
        IEmployeeRepository employeeRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.Year).GreaterThan(0);
        RuleFor(x => x.Month).InclusiveBetween(1, 12);
        RuleFor(x => x.BaseSalary).GreaterThanOrEqualTo(0);
        RuleFor(x => x.GrossAmount).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Deductions).GreaterThanOrEqualTo(0);
        RuleFor(x => x.NetAmount).GreaterThanOrEqualTo(0);

        RuleFor(x => x)
            .Must(request => request.NetAmount == request.GrossAmount - request.Deductions)
            .WithMessage(MessageKeys.InvalidPayrollNetAmount);

        RuleFor(x => x.Status)
            .IsInEnum()
            .Must(status => status != default)
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.Notes).MaximumLength(500);

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (employeeId, cancellationToken)
                => await employeeRepository.AnyAsync(x => x.Id == employeeId, cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken) =>
                !await payrollEntryRepository.AnyAsync(
                    x => x.EmployeeId == request.EmployeeId
                         && x.Year == request.Year
                         && x.Month == request.Month
                         && x.Id != request.Id,
                    cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);
    }
}
