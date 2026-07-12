using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record ChangeEmailRequest : IRequest<OperationResult>
{
    public string Token { get; init; } = default!;
    public string Email { get; init; } = default!;
}