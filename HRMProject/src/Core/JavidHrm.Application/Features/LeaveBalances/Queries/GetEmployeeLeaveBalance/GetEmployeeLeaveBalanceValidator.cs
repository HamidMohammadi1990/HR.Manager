using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetEmployeeLeaveBalanceValidator : AbstractValidator<GetEmployeeLeaveBalanceRequest>
{
    public GetEmployeeLeaveBalanceValidator()
    {
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.LeaveTypeDefinitionId).MustBeValidEntityId();
        RuleFor(x => x.Year).GreaterThan(2000).When(x => x.Year.HasValue);
    }
}
