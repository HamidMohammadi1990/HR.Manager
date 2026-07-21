using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CheckOutAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository,
     IWorkShiftRepository workShiftRepository,
     IAttendanceMetricsService attendanceMetricsService,
     IUnitOfWork uow)
    : IRequestHandler<CheckOutAttendanceRecordRequest, OperationResult<CheckOutAttendanceRecordResponse>>
{
    public async Task<OperationResult<CheckOutAttendanceRecordResponse>> Handle(
        CheckOutAttendanceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var nowUtc = DateTime.UtcNow;
        var workDate = (request.WorkDate ?? nowUtc).Date;

        var existing = await attendanceRecordRepository.FindByEmployeeAndWorkDateAsync(
            request.EmployeeId,
            workDate,
            cancellationToken);

        if (existing is null || !existing.CheckInUtc.HasValue)
            return ErrorModel.Create(MessageKeys.AttendanceNotCheckedIn);

        if (existing.CheckOutUtc.HasValue)
            return ErrorModel.Create(MessageKeys.AttendanceAlreadyCheckedOut);

        if (nowUtc <= existing.CheckInUtc.Value)
            return ErrorModel.Create(MessageKeys.CheckOutMustBeAfterCheckIn);

        var shift = existing.WorkShiftId is not null
            ? await workShiftRepository.FindAsync(existing.WorkShiftId.Value, cancellationToken)
            : null;

        var metrics = attendanceMetricsService.EvaluateCheckOut(
            shift,
            workDate,
            existing.CheckInUtc.Value,
            nowUtc,
            existing.Status,
            existing.LateMinutes);

        existing.RegisterCheckOut(
            nowUtc,
            metrics.Status,
            metrics.EarlyLeaveMinutes,
            metrics.OvertimeMinutes,
            metrics.WorkedMinutes);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess
            ? new CheckOutAttendanceRecordResponse { Id = existing.Id }
            : saveChangesResult.ToGenericFailure<CheckOutAttendanceRecordResponse>();
    }
}
