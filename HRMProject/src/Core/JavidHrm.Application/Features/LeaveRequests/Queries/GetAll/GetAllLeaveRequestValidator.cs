using FluentValidation;

namespace JavidHrm.Application.Features.LeaveRequests.Queries;

public class GetAllLeaveRequestValidator : AbstractValidator<GetAllLeaveRequestRequest>
{
    public GetAllLeaveRequestValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
