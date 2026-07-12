using JavidHrm.Common.Models;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetForgetPasswordOptionRequest : IRequest<OperationResult<GetForgetPasswordOptionResponse>>
{
    public string UserName { get; init; } = default!;
}