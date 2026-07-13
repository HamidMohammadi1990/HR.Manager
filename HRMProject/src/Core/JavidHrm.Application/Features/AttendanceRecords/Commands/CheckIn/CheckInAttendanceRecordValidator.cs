using FluentValidation;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Domain.Repositories;
using JavidHrm.Common.Localization;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CheckInAttendanceRecordValidator : AbstractValidator<CheckInAttendanceRecordRequest>
{
    public CheckInAttendanceRecordValidator(IEmployeeRepository employeeRepository)
    {
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (employeeId, cancellationToken)
                => await employeeRepository.AnyAsync(x => x.Id == employeeId, cancellationToken))
            .WithMessage(MessageKeys.InvalidId);
    }
}
