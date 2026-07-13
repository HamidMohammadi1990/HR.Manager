using FluentValidation;

namespace JavidHrm.Application.Features.LeaveBalances.Queries;

public class GetAllLeaveBalanceValidator : AbstractValidator<GetAllLeaveBalanceRequest>
{
    public GetAllLeaveBalanceValidator() => RuleFor(x => x.Pagination).NotNull();
}
