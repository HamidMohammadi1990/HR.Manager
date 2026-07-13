using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.LeaveRequests;

public class GetAllLeaveRequestResponseDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? UserName { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = default!;
    public string EmployeeCode { get; set; } = default!;
    public LeaveType LeaveType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public LeaveRequestStatus Status { get; set; }
    public string Reason { get; set; } = default!;
    public DateTime CreatedOnUtc { get; set; }
}
