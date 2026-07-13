using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Commands;

public record SendEmailTokenRequest : IRequest<OperationResult<SendEmailTokenResponse>>
{
    public string UserName { get; set; } = default!;
}