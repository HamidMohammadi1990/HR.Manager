using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class UpdateLeaveBalanceValidator : AbstractValidator<UpdateLeaveBalanceRequest>
{
    public UpdateLeaveBalanceValidator(
        IEmployeeRepository employeeRepository,
        ILeaveBalanceRepository leaveBalanceRepository,
        ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.LeaveTypeDefinitionId).MustBeValidEntityId();

        RuleFor(x => x.LeaveTypeDefinitionId)
            .MustAsync(async (leaveTypeDefinitionId, cancellationToken)
                => await leaveTypeDefinitionRepository.AnyAsync(
                    x => x.Id == leaveTypeDefinitionId && x.IsActive,
                    cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.Year).GreaterThan(2000);
        RuleFor(x => x.TotalDays).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UsedDays).GreaterThanOrEqualTo(0);
        RuleFor(x => x.UsedDays).LessThanOrEqualTo(x => x.TotalDays);

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (employeeId, cancellationToken)
                => await employeeRepository.AnyAsync(x => x.Id == employeeId, cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken)
                => !await leaveBalanceRepository.ExistsAsync(
                    request.EmployeeId,
                    request.LeaveTypeDefinitionId,
                    request.Year,
                    request.Id,
                    cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);
    }
}
