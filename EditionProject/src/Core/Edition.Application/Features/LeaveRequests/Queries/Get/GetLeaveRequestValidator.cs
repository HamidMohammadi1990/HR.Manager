using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public class GetLeaveRequestValidator : AbstractValidator<GetLeaveRequestRequest>
{
    public GetLeaveRequestValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
