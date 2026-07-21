using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CreateAttendanceRecordHandler
    (IUnitOfWork uow,
     IAttendanceRecordRepository attendanceRecordRepository,
     IWorkShiftResolutionService workShiftResolutionService,
     IAttendanceMetricsService attendanceMetricsService)
    : IRequestHandler<CreateAttendanceRecordRequest, OperationResult<CreateAttendanceRecordResponse>>
{
    public async Task<OperationResult<CreateAttendanceRecordResponse>> Handle(
        CreateAttendanceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var workDate = request.WorkDate.Date;
        var shift = await workShiftResolutionService.ResolveForEmployeeAsync(
            request.EmployeeId,
            workDate,
            cancellationToken);

        int? workShiftId = shift?.Id;
        var status = request.Status;
        var lateMinutes = 0;
        var earlyLeaveMinutes = 0;
        var overtimeMinutes = 0;
        var workedMinutes = 0;

        if (request.CheckInUtc.HasValue)
        {
            var checkInMetrics = attendanceMetricsService.EvaluateCheckIn(
                shift,
                request.CheckInUtc.Value,
                workDate);
            workShiftId = checkInMetrics.WorkShiftId ?? workShiftId;
            lateMinutes = checkInMetrics.LateMinutes;
            status = checkInMetrics.Status;

            if (request.CheckOutUtc.HasValue)
            {
                var checkOutMetrics = attendanceMetricsService.EvaluateCheckOut(
                    shift,
                    workDate,
                    request.CheckInUtc.Value,
                    request.CheckOutUtc.Value,
                    status,
                    lateMinutes);
                status = checkOutMetrics.Status;
                earlyLeaveMinutes = checkOutMetrics.EarlyLeaveMinutes;
                overtimeMinutes = checkOutMetrics.OvertimeMinutes;
                workedMinutes = checkOutMetrics.WorkedMinutes;
            }
        }

        var attendanceRecord = Domain.Entities.AttendanceRecord.Create(
            request.EmployeeId,
            workDate,
            workShiftId,
            request.CheckInUtc,
            request.CheckOutUtc,
            status,
            lateMinutes,
            earlyLeaveMinutes,
            overtimeMinutes,
            workedMinutes);

        attendanceRecordRepository.Add(attendanceRecord);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateAttendanceRecordResponse>();

        return new CreateAttendanceRecordResponse { Id = attendanceRecord.Id };
    }
}
