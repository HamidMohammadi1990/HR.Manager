using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class UpdateAttendanceRecordValidator : AbstractValidator<UpdateAttendanceRecordRequest>
{
    public UpdateAttendanceRecordValidator(
        IAttendanceRecordRepository attendanceRecordRepository,
        IEmployeeRepository employeeRepository)
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.WorkDate).NotEmpty();

        RuleFor(x => x.Status)
            .IsInEnum()
            .Must(status => status != default)
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x.EmployeeId)
            .MustAsync(async (employeeId, cancellationToken)
                => await employeeRepository.AnyAsync(x => x.Id == employeeId, cancellationToken))
            .WithMessage(MessageKeys.InvalidId);

        RuleFor(x => x)
            .MustAsync(async (request, cancellationToken) =>
                !await attendanceRecordRepository.AnyAsync(
                    x => x.EmployeeId == request.EmployeeId
                         && x.WorkDate == request.WorkDate.Date
                         && x.Id != request.Id,
                    cancellationToken))
            .WithMessage(MessageKeys.DuplicateRecord);
    }
}
