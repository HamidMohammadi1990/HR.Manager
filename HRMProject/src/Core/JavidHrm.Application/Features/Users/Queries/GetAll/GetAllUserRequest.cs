using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetAllUserRequest : IRequest<OperationResult<PagedResult<GetAllUserResponse>>>, IContentPolicyFilteredRequest<User>
{
    public string? UserName { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Email { get; init; }
    public bool? EmailConfirmed { get; init; }
    public string? PhoneNumber { get; init; }
    public bool? PhoneNumberConfirmed { get; init; }
    public bool? LoginPermission { get; init; }
    public GenderType? Gender { get; init; }
    public bool? IsActive { get; init; }

    public string? Search { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}