using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record RegisterUserRequest : IRequest<OperationResult>
{
    public string Token { get; init; } = default!;
    public string UserName { get; init; } = default!;
}