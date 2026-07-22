using JavidHrm.Common.Models;
using MediatR;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetCurrentUserPermissionsRequest : IRequest<OperationResult<GetCurrentUserPermissionsResponse>>;

public record GetCurrentUserPermissionsResponse
{
    public List<int> Permissions { get; init; } = [];
}
