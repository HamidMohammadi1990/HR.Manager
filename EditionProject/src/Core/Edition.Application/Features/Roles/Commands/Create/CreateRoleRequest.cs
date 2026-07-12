using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Roles.Commands;

public record CreateRoleRequest : IRequest<OperationResult<CreateRoleResponse>>
{
    public string Title { get; init; } = default!;
}