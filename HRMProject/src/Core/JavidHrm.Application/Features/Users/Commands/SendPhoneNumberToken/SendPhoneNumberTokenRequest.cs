using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record SendPhoneNumberTokenRequest : IRequest<OperationResult<SendPhoneNumberTokenResponse>>
{
    public string UserName { get; init; } = default!;
}