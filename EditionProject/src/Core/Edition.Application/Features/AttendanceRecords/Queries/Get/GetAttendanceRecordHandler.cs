using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public class GetAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, IAttendanceRecordMapperService mapper)
    : IRequestHandler<GetAttendanceRecordRequest, OperationResult<GetAttendanceRecordResponse?>>
{
    public async Task<OperationResult<GetAttendanceRecordResponse?>> Handle(GetAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var attendanceRecord = await attendanceRecordRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (attendanceRecord is null)
            return (GetAttendanceRecordResponse?)null;

        var employee = await employeeRepository.GetAsNoTrackingAsync(attendanceRecord.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create("InvalidId").ToGenericFailure<GetAttendanceRecordResponse?>();

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create("InvalidId").ToGenericFailure<GetAttendanceRecordResponse?>();

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create("InvalidId").ToGenericFailure<GetAttendanceRecordResponse?>();

        return mapper.Map(attendanceRecord, employee, user, department);
    }
}
