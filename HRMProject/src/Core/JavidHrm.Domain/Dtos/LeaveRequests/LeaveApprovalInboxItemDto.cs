using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.LeaveRequests;

public class LeaveApprovalInboxItemDto
{
    public int LeaveRequestId { get; init; }
    public int StepOrder { get; init; }
    public int EmployeeId { get; init; }
    public string? UserFirstName { get; init; }
    public string? UserLastName { get; init; }
    public string EmployeeCode { get; init; } = default!;
    public int DepartmentId { get; init; }
    public string DepartmentName { get; init; } = default!;
    public int LeaveTypeDefinitionId { get; init; }
    public string LeaveTypeName { get; init; } = default!;
    public LeaveTypeUnit LeaveTypeUnit { get; init; }
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
    public string Reason { get; init; } = default!;
    public DateTime CreatedOnUtc { get; init; }
    public int? CurrentApprovalStepOrder { get; init; }
    public int? TotalApprovalSteps { get; init; }
    public bool IsHrPoolStep { get; init; }
}
