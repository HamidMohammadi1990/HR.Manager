using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using MediatR;

namespace JavidHrm.Application.Features.Users.Commands;

public record UpdateCurrentUserProfileRequest : IRequest<OperationResult>
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhoneNumber { get; init; } = default!;

    [JsonConverter(typeof(CityEncryptor))]
    public int CityId { get; init; }

    public GenderType Gender { get; init; }
}
