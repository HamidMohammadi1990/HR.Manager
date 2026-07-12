using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class DeleteAttendanceRecordValidator : AbstractValidator<DeleteAttendanceRecordRequest>
{
    public DeleteAttendanceRecordValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
