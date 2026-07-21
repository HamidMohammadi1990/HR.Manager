using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Users;

public record GetAllUserRequestDto
{
    [QueryFilter(MemberPath = "UserName", Operator = FilterOperator.Contains)]
    public string? UserName { get; init; }

    [QueryFilter(MemberPath = "FirstName", Operator = FilterOperator.Contains)]
    public string? FirstName { get; init; }

    [QueryFilter(MemberPath = "LastName", Operator = FilterOperator.Contains)]
    public string? LastName { get; init; }

    [QueryFilter(MemberPath = "Email", Operator = FilterOperator.Contains)]
    public string? Email { get; init; }

    [QueryFilter(MemberPath = "PhoneNumber", Operator = FilterOperator.Contains)]
    public string? PhoneNumber { get; init; }

    [QueryFilter(MemberPath = "EmailConfirmed")]
    public bool? EmailConfirmed { get; init; }

    [QueryFilter(MemberPath = "PhoneNumberConfirmed")]
    public bool? PhoneNumberConfirmed { get; init; }

    [QueryFilter(MemberPath = "LoginPermission")]
    public bool? LoginPermission { get; init; }

    [QueryFilter(MemberPath = "Gender")]
    public GenderType? Gender { get; init; }

    [QueryFilter(MemberPath = "IsActive")]
    public bool? IsActive { get; init; }

    public string? Search { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
