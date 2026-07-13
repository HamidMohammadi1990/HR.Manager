using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.AttendanceRecords.Commands;

public class DeleteAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteAttendanceRecordRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = await attendanceRecordRepository.FindAsync(request.Id, cancellationToken);
        if (attendanceRecord is null)
            return ErrorModel.Create("InvalidId");

        attendanceRecordRepository.Remove(attendanceRecord);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
