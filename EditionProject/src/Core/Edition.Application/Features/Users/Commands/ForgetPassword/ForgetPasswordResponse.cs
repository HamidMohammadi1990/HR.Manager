using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Users.Commands;

public record ForgetPasswordResponse
{
    public string Message { get; init; } = default!;
    public string UserName { get; init; } = default!;
    public ForgetPasswordOptionType OptionType { get; init; }
}