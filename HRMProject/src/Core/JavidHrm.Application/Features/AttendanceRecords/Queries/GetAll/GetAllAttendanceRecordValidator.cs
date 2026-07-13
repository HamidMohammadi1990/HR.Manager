using FluentValidation;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public class GetAllAttendanceRecordValidator : AbstractValidator<GetAllAttendanceRecordRequest>
{
    public GetAllAttendanceRecordValidator()
    {
        RuleFor(x => x.Pagination).NotNull();
    }
}
