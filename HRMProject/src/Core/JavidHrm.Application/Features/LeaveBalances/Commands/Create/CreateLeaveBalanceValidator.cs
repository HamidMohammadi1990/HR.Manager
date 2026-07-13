using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class CreateLeaveBalanceValidator : AbstractValidator<CreateLeaveBalanceRequest>
{
    public CreateLeaveBalanceValidator(
        IEmployeeRepository employeeRepository,
        ILeaveBalanceRepository leaveBalanceRepository)
    {
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.LeaveType).IsInEnum().Must(t => t != default).WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.Year).GreaterThan(2000).LessThanOrEqualTo(2100);
        RuleFor(x => x.TotalDays).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UsedDays).GreaterThanOrEqualTo(0);
        RuleFor(x => x).Must(r => r.UsedDays <= r.TotalDays).WithMessage(MessageKeys.InvalidRequest);

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (id, ct) => await employeeRepository.AnyAsync(e => e.Id == id, ct))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x)
            .MustAsync(async (request, ct) =>
                !await leaveBalanceRepository.ExistsAsync(
                    request.EmployeeId,
                    request.LeaveType,
                    request.Year,
                    excludeId: null,
                    ct))
            .WithMessage(MessageKeys.DuplicateRecord);
    }
}
