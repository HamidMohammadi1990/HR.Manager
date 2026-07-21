using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.AttendanceRecords;

public class GetAllAttendanceRecordResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public string EmployeeCode { get; set; } = default!;
    public DateTime WorkDate { get; set; }
    public DateTime? CheckInUtc { get; set; }
    public DateTime? CheckOutUtc { get; set; }
    public AttendanceStatus Status { get; set; }
    public int? WorkShiftId { get; set; }
    public string? WorkShiftName { get; set; }
    public int LateMinutes { get; set; }
    public int EarlyLeaveMinutes { get; set; }
    public int OvertimeMinutes { get; set; }
    public int WorkedMinutes { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
