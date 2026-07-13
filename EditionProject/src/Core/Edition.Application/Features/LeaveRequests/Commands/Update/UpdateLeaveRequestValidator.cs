using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class UpdateLeaveRequestValidator : AbstractValidator<UpdateLeaveRequestRequest>
{
    public UpdateLeaveRequestValidator(
        IEmployeeRepository employeeRepository,
        ILeaveRequestRepository leaveRequestRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();

        RuleFor(x => x.LeaveType)
            .IsInEnum()
            .Must(leaveType => leaveType != default)
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).NotEmpty();

        RuleFor(x => x)
            .Must(request => request.EndDate.Date >= request.StartDate.Date)
            .WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);

        RuleFor(x => x.Status)
            .IsInEnum()
            .Must(status => status != default)
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500);

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (employeeId, cancellationToken)
                => await employeeRepository.AnyAsync(x => x.Id == employeeId, cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken) =>
                !await leaveRequestRepository.HasOverlappingAsync(
                    request.EmployeeId,
                    request.StartDate,
                    request.EndDate,
                    excludeLeaveRequestId: request.Id,
                    cancellationToken))
            .WithMessage(MessageKeys.OverlappingLeavePeriod);
    }
}
