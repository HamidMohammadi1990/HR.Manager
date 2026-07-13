using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class RejectLeaveRequestValidator : AbstractValidator<RejectLeaveRequestRequest>
{
    public RejectLeaveRequestValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
