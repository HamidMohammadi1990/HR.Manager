using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetLeaveBalanceValidator : AbstractValidator<GetLeaveBalanceRequest>
{
    public GetLeaveBalanceValidator() => RuleFor(x => x.Id).MustBeValidEntityId();
}
