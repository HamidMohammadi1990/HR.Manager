using FluentValidation;
using JavidHrm.Application.Common.Validation;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public class GetAttendanceRecordValidator : AbstractValidator<GetAttendanceRecordRequest>
{
    public GetAttendanceRecordValidator()
    {
        RuleFor(x => x.Id).MustBeValidEntityId();
    }
}
