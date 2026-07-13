using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Cities.Queries;

public record GetCityRequest : IRequest<OperationResult<GetCityResponse>>
{
    [JsonConverter(typeof(CityEncryptor))]
    public int Id { get; init; }
}