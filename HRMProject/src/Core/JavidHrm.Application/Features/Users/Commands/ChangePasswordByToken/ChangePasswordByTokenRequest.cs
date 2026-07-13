using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record ChangePasswordByTokenRequest : IRequest<OperationResult<ChangePasswordByTokenResponse>>
{
    public string Token { get; init; } = default!;
    public string UserName { get; init; } = default!;
    public string Password { get; init; } = default!;
    public ForgetPasswordOptionType OptionType { get; init; }
}