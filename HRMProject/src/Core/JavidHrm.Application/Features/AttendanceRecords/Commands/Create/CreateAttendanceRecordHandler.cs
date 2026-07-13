using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CreateAttendanceRecordHandler
    (IUnitOfWork uow, IAttendanceRecordRepository attendanceRecordRepository)
    : IRequestHandler<CreateAttendanceRecordRequest, OperationResult<CreateAttendanceRecordResponse>>
{
    public async Task<OperationResult<CreateAttendanceRecordResponse>> Handle(CreateAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = Domain.Entities.AttendanceRecord.Create(
            request.EmployeeId,
            request.WorkDate,
            request.CheckInUtc,
            request.CheckOutUtc,
            request.Status);

        attendanceRecordRepository.Add(attendanceRecord);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateAttendanceRecordResponse>();

        return new CreateAttendanceRecordResponse { Id = attendanceRecord.Id };
    }
}
