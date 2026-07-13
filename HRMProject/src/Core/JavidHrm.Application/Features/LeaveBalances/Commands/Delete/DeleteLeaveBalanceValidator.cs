using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveBalances.Commands;

public class DeleteLeaveBalanceValidator : AbstractValidator<DeleteLeaveBalanceRequest>
{
    public DeleteLeaveBalanceValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
