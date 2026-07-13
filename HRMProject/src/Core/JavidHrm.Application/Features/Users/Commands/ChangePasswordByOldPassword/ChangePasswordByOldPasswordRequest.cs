using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record ChangePasswordByOldPasswordRequest : IRequest<OperationResult<SignInUserResponse>>
{
    public string OldPassword { get; init; } = default!;
    public string NewPassword { get; init; } = default!;
}
