using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using MediatR;

namespace JavidHrm.Application.Features.Users.Commands;

public record UpdateCurrentUserProfileRequest : IRequest<OperationResult>
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;
    public GenderType Gender { get; init; }
}
