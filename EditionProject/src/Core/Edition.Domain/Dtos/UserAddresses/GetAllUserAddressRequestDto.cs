using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.UserAddresses;

public record GetAllUserAddressRequestDto
{
    [QueryFilter(MemberPath = "address.IsActive")]
    public bool? IsActive { get; init; }

    [QueryFilter(MemberPath = "address.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    [QueryFilter(MemberPath = "address.CityId")]
    public int? CityId { get; init; }

    [QueryFilter(MemberPath = "address.UserId")]
    public int? UserId { get; init; }

    [QueryFilter(MemberPath = "address.PostalCode", Operator = FilterOperator.Contains)]
    public string? PostalCode { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
