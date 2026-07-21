using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CheckInAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository,
     IWorkShiftResolutionService workShiftResolutionService,
     IAttendanceMetricsService attendanceMetricsService,
     IUnitOfWork uow)
    : IRequestHandler<CheckInAttendanceRecordRequest, OperationResult<CheckInAttendanceRecordResponse>>
{
    public async Task<OperationResult<CheckInAttendanceRecordResponse>> Handle(
        CheckInAttendanceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var nowUtc = DateTime.UtcNow;
        var workDate = (request.WorkDate ?? nowUtc).Date;

        var shift = await workShiftResolutionService.ResolveForEmployeeAsync(
            request.EmployeeId,
            workDate,
            cancellationToken);
        var metrics = attendanceMetricsService.EvaluateCheckIn(shift, nowUtc, workDate);

        var existing = await attendanceRecordRepository.FindByEmployeeAndWorkDateAsync(
            request.EmployeeId,
            workDate,
            cancellationToken);

        if (existing is not null)
        {
            if (existing.CheckInUtc.HasValue)
                return ErrorModel.Create(MessageKeys.AttendanceAlreadyCheckedIn);

            existing.RegisterCheckIn(nowUtc, metrics.Status, metrics.WorkShiftId, metrics.LateMinutes);
            var updateResult = await uow.SaveChangesAsync(cancellationToken);
            return updateResult.IsSuccess
                ? new CheckInAttendanceRecordResponse { Id = existing.Id }
                : updateResult.ToGenericFailure<CheckInAttendanceRecordResponse>();
        }

        var attendanceRecord = Domain.Entities.AttendanceRecord.Create(
            request.EmployeeId,
            workDate,
            metrics.WorkShiftId,
            nowUtc,
            null,
            metrics.Status,
            metrics.LateMinutes);

        attendanceRecordRepository.Add(attendanceRecord);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CheckInAttendanceRecordResponse>();

        return new CheckInAttendanceRecordResponse { Id = attendanceRecord.Id };
    }
}
