using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class UpdateAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateAttendanceRecordRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = await attendanceRecordRepository.FindAsync(request.Id, cancellationToken);
        if (attendanceRecord is null)
            return ErrorModel.Create("InvalidId");

        attendanceRecord.Update(
            request.EmployeeId,
            request.WorkDate,
            request.CheckInUtc,
            request.CheckOutUtc,
            request.Status);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
