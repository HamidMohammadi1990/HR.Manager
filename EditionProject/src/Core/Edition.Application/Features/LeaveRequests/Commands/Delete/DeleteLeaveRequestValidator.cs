using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class DeleteLeaveRequestValidator : AbstractValidator<DeleteLeaveRequestRequest>
{
    public DeleteLeaveRequestValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
