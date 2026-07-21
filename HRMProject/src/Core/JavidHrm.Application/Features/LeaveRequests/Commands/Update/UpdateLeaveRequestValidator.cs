using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.LeaveRequests.Commands;

public class UpdateLeaveRequestValidator : AbstractValidator<UpdateLeaveRequestRequest>
{
    public UpdateLeaveRequestValidator(
        IEmployeeRepository employeeRepository,
        ILeaveRequestRepository leaveRequestRepository,
        ILeaveTypeDefinitionRepository leaveTypeDefinitionRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.LeaveTypeDefinitionId).MustBeValidEntityId();

        RuleFor(x => x.LeaveTypeDefinitionId)
            .MustAsync(async (leaveTypeDefinitionId, cancellationToken)
                => await leaveTypeDefinitionRepository.AnyAsync(
                    x => x.Id == leaveTypeDefinitionId && x.IsActive,
                    cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.StartDate).NotEmpty();
        RuleFor(x => x.EndDate).NotEmpty();

        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken) =>
            {
                var leaveTypeDefinition = await leaveTypeDefinitionRepository.FindAsync(
                    request.LeaveTypeDefinitionId,
                    cancellationToken);
                if (leaveTypeDefinition is null)
                    return false;

                return leaveTypeDefinition.Unit == LeaveTypeUnit.Hour
                    ? request.EndDate > request.StartDate
                    : request.EndDate.Date >= request.StartDate.Date;
            })
            .WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);

        RuleFor(x => x.Status)
            .IsInEnum()
            .Must(status => status != default)
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage(MessageKeys.NameRequired)
            .MaximumLength(500);

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
