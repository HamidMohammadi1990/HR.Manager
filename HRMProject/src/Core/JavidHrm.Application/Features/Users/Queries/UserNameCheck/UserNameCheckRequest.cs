using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Queries;

public record UserNameCheckRequest : IRequest<OperationResult<UserNameCheckResponse>>
{
    public string UserName { get; init; } = default!;
}