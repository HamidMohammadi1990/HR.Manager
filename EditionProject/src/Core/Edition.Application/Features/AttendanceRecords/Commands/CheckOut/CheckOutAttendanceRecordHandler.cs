using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class CheckOutAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IUnitOfWork uow)
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

        existing.RegisterCheckOut(nowUtc);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess
            ? new CheckOutAttendanceRecordResponse { Id = existing.Id }
            : saveChangesResult.ToGenericFailure<CheckOutAttendanceRecordResponse>();
    }
}
