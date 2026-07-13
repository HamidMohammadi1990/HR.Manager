using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Permissions.Queries;

public record HasPermissionRequest : IRequest<OperationResult<HasPermissionResponse>>
{
    public int UserId { get; init; }
    public PermissionType PermissionType { get; init; }
}