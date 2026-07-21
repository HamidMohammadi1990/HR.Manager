using JavidHrm.Common.Models;

using JavidHrm.Domain.Enums;



namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;



public record CreateLeaveTypeDefinitionRequest : IRequest<OperationResult<CreateLeaveTypeDefinitionResponse>>

{

    public string Code { get; init; } = default!;

    public string Name { get; init; } = default!;

    public string? Description { get; init; }

    public LeaveTypeCategory Category { get; init; }

    public LeaveTypeUnit Unit { get; init; }

    public bool IsPaid { get; init; }

    public bool AffectsLeaveBalance { get; init; }

    public bool RequiresApproval { get; init; } = true;

    public decimal? DefaultAnnualAllowance { get; init; }

    public decimal? MaxPerYear { get; init; }

    public decimal? MaxPerRequest { get; init; }

    public int? MinNoticeDays { get; init; }

    public bool AllowNegativeBalance { get; init; }

    public bool CarryForwardEnabled { get; init; }

    public decimal? MaxCarryForwardDays { get; init; }

    public bool IncludeWeekends { get; init; }

    public bool IncludeHolidays { get; init; }

    public int SortOrder { get; init; }

    public string? Color { get; init; }

}

