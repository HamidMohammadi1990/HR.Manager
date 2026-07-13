using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CheckInAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IUnitOfWork uow)
    : IRequestHandler<CheckInAttendanceRecordRequest, OperationResult<CheckInAttendanceRecordResponse>>
{
    private static readonly TimeSpan IranOffset = TimeSpan.FromHours(3.5);
    private static readonly TimeSpan LateThreshold = TimeSpan.FromHours(9);

    public async Task<OperationResult<CheckInAttendanceRecordResponse>> Handle(
        CheckInAttendanceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var nowUtc = DateTime.UtcNow;
        var workDate = (request.WorkDate ?? nowUtc).Date;

        var existing = await attendanceRecordRepository.FindByEmployeeAndWorkDateAsync(
            request.EmployeeId,
            workDate,
            cancellationToken);

        if (existing is not null)
        {
            if (existing.CheckInUtc.HasValue)
                return ErrorModel.Create(MessageKeys.AttendanceAlreadyCheckedIn);

            existing.RegisterCheckIn(nowUtc, DetermineStatus(nowUtc));
            var updateResult = await uow.SaveChangesAsync(cancellationToken);
            return updateResult.IsSuccess
                ? new CheckInAttendanceRecordResponse { Id = existing.Id }
                : updateResult.ToGenericFailure<CheckInAttendanceRecordResponse>();
        }

        var attendanceRecord = Domain.Entities.AttendanceRecord.Create(
            request.EmployeeId,
            workDate,
            nowUtc,
            null,
            DetermineStatus(nowUtc));

        attendanceRecordRepository.Add(attendanceRecord);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CheckInAttendanceRecordResponse>();

        return new CheckInAttendanceRecordResponse { Id = attendanceRecord.Id };
    }

    private static AttendanceStatus DetermineStatus(DateTime checkInUtc)
    {
        var localTime = checkInUtc.Add(IranOffset).TimeOfDay;
        return localTime > LateThreshold ? AttendanceStatus.Late : AttendanceStatus.Present;
    }
}
