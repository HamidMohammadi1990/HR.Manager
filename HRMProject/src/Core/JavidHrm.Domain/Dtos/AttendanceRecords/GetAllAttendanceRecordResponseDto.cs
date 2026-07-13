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
    public DateTime CreatedOnUtc { get; set; }
}
