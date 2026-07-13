using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record ForgetPasswordRequest : IRequest<OperationResult<ForgetPasswordResponse>>
{
    public string UserName { get; init; } = default!;
    public ForgetPasswordOptionType OptionType { get; init; }
}