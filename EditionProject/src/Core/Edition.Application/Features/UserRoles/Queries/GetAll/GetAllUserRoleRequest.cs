using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserRoles.Queries;

public record GetAllUserRoleRequest : IRequest<OperationResult<PagedResult<GetAllUserRoleResponse>>>, IContentPolicyFilteredRequest<UserRole>
{
    [JsonConverter(typeof(UserNullableEncryptor))]
    public int? UserId { get; init; }

    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
