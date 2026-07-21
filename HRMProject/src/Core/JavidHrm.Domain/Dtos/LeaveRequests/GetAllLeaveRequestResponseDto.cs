using JavidHrm.Domain.Dtos.LeaveRequests;
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
    public int LeaveTypeDefinitionId { get; set; }
    public string LeaveTypeName { get; set; } = default!;
    public LeaveTypeUnit LeaveTypeUnit { get; set; }
    public string LeaveTypeCode { get; set; } = default!;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public LeaveRequestStatus Status { get; set; }
    public string Reason { get; set; } = default!;
    public DateTime CreatedOnUtc { get; set; }
    public int? CurrentApprovalStepOrder { get; set; }
    public int? TotalApprovalSteps { get; set; }
}
