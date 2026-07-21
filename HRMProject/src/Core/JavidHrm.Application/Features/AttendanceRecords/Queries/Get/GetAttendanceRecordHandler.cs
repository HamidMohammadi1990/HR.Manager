using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public class GetAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository,
     IEmployeeRepository employeeRepository,
     IUserRepository userRepository,
     IDepartmentRepository departmentRepository,
     IWorkShiftRepository workShiftRepository,
     IAttendanceRecordMapperService mapper)
    : IRequestHandler<GetAttendanceRecordRequest, OperationResult<GetAttendanceRecordResponse?>>
{
    public async Task<OperationResult<GetAttendanceRecordResponse?>> Handle(GetAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = await attendanceRecordRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (attendanceRecord is null)
            return (GetAttendanceRecordResponse?)null;

        var employee = await employeeRepository.GetAsNoTrackingAsync(attendanceRecord.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId");

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId");

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId");

        string? workShiftName = null;
        if (attendanceRecord.WorkShiftId is not null)
        {
            var workShift = await workShiftRepository.GetAsNoTrackingAsync(
                attendanceRecord.WorkShiftId.Value,
                cancellationToken);
            workShiftName = workShift?.Name;
        }

        return mapper.Map(attendanceRecord, employee, user, department, workShiftName);
    }
}
