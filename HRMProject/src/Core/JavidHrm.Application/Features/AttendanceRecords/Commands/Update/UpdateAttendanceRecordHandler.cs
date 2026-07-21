using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class UpdateAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository,
     IWorkShiftResolutionService workShiftResolutionService,
     IAttendanceMetricsService attendanceMetricsService,
     IUnitOfWork uow)
    : IRequestHandler<UpdateAttendanceRecordRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = await attendanceRecordRepository.FindAsync(request.Id, cancellationToken);
        if (attendanceRecord is null)
            return ErrorModel.Create("InvalidId");

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

        attendanceRecord.Update(
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

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
