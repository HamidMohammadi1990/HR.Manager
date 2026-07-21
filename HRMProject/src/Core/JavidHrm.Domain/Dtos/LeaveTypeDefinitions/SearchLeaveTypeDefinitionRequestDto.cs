using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.LeaveTypeDefinitions;

public record SearchLeaveTypeDefinitionRequestDto
{
    [QueryFilter(MemberPath = "leaveTypeDefinition.Code")]
    public string? Code { get; init; }

    [QueryFilter(MemberPath = "leaveTypeDefinition.Name", Operator = FilterOperator.Contains)]
    public string? Name { get; init; }

    [QueryFilter(MemberPath = "leaveTypeDefinition.Category")]
    public LeaveTypeCategory? Category { get; init; }

    [QueryFilter(MemberPath = "leaveTypeDefinition.Unit")]
    public LeaveTypeUnit? Unit { get; init; }

    [QueryFilter(MemberPath = "leaveTypeDefinition.IsPaid")]
    public bool? IsPaid { get; init; }

    [QueryFilter(MemberPath = "leaveTypeDefinition.IsActive")]
    public bool? IsActive { get; set; }

    public PagedRequest Pagination { get; init; } = default!;
}
