using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class ApproveLeaveRequestValidator : AbstractValidator<ApproveLeaveRequestRequest>
{
    public ApproveLeaveRequestValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
