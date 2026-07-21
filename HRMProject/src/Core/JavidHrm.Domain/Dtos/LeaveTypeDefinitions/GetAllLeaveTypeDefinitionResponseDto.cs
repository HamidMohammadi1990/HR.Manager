using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.LeaveTypeDefinitions;

public class GetAllLeaveTypeDefinitionResponseDto
{
    public int Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public LeaveTypeCategory Category { get; set; }
    public LeaveTypeUnit Unit { get; set; }
    public bool IsPaid { get; set; }
    public bool IsActive { get; set; }
    public bool AffectsLeaveBalance { get; set; }
    public bool RequiresApproval { get; set; }
    public decimal? DefaultAnnualAllowance { get; set; }
    public decimal? MaxPerYear { get; set; }
    public decimal? MaxPerRequest { get; set; }
    public int? MinNoticeDays { get; set; }
    public bool AllowNegativeBalance { get; set; }
    public bool CarryForwardEnabled { get; set; }
    public decimal? MaxCarryForwardDays { get; set; }
    public bool IncludeWeekends { get; set; }
    public bool IncludeHolidays { get; set; }
    public int SortOrder { get; set; }
    public string? Color { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
