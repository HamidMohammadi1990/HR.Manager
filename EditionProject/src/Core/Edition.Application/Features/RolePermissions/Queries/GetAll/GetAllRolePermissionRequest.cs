using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Dtos.Pagination;
using System.Text.Json.Serialization;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.RolePermissions.Queries;

public record GetAllRolePermissionRequest : IRequest<OperationResult<PagedResult<GetAllRolePermissionResponse>>>, IContentPolicyFilteredRequest<RolePermission>
{
    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    [JsonConverter(typeof(PermissionNullableEncryptor))]
    public PermissionType? PermissionId { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
