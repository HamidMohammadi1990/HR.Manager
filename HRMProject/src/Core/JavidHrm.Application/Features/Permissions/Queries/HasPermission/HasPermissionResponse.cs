namespace JavidHrm.Application.Features.Permissions.Queries;

public record HasPermissionResponse
{
    public bool HasPermission { get; init; }
}