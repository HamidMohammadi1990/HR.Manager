using JavidHrm.Application.Features.AttendanceRecords.Queries;
using JavidHrm.Domain.Dtos.AttendanceRecords;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class AttendanceRecordMapperService : IAttendanceRecordMapperService
{
    public GetAllAttendanceRecordRequestDto Map(GetAllAttendanceRecordRequest model)
        => new()
        {
            EmployeeId = model.EmployeeId,
            DepartmentId = model.DepartmentId,
            UserId = model.UserId,
            WorkDate = model.WorkDate,
            WorkDateFrom = model.WorkDateFrom,
            WorkDateTo = model.WorkDateTo,
            Status = model.Status,
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmployeeCode = model.EmployeeCode,
            Pagination = model.Pagination
        };

    public GetAttendanceRecordResponse Map(
        AttendanceRecord model,
        Employee employee,
        User user,
        Department department,
        string? workShiftName = null)
        => new()
        {
            Id = model.Id,
            EmployeeId = model.EmployeeId,
            UserFirstName = user.FirstName,
            UserLastName = user.LastName,
            UserName = user.UserName,
            DepartmentId = employee.DepartmentId,
            DepartmentName = department.Name,
            EmployeeCode = employee.EmployeeCode,
            WorkDate = model.WorkDate,
            CheckInUtc = model.CheckInUtc,
            CheckOutUtc = model.CheckOutUtc,
            Status = model.Status,
            WorkShiftId = model.WorkShiftId,
            WorkShiftName = workShiftName,
            LateMinutes = model.LateMinutes,
            EarlyLeaveMinutes = model.EarlyLeaveMinutes,
            OvertimeMinutes = model.OvertimeMinutes,
            WorkedMinutes = model.WorkedMinutes,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllAttendanceRecordResponse> Map(PagedResult<GetAllAttendanceRecordResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllAttendanceRecordResponse
        {
            Id = x.Id,
            EmployeeId = x.EmployeeId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            EmployeeCode = x.EmployeeCode,
            WorkDate = x.WorkDate,
            CheckInUtc = x.CheckInUtc,
            CheckOutUtc = x.CheckOutUtc,
            Status = x.Status,
            WorkShiftId = x.WorkShiftId,
            WorkShiftName = x.WorkShiftName,
            LateMinutes = x.LateMinutes,
            EarlyLeaveMinutes = x.EarlyLeaveMinutes,
            OvertimeMinutes = x.OvertimeMinutes,
            WorkedMinutes = x.WorkedMinutes,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllAttendanceRecordResponse>.Create(items, model);
    }
}
