using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record SendEmailTokenResponse
{
    public ErrorModel Message { get; set; } = default!;
    public ForgetPasswordOptionType OptionType { get; set; }
}