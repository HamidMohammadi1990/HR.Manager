using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.ContentPolicies;

public record GetAllContentPolicyRecordAccessRequestDto
{
    [QueryFilter]
    public int? PolicyId { get; init; }

    [QueryFilter(MemberPath = "Policy.EntityType")]
    public string? EntityType { get; init; }

    [QueryFilter]
    public int? EntityId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
